import json
import os
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app
from flask_login import login_required, current_user
from extensions import db
from models.job import Job
from models.candidate import Candidate, CandidateScore
from models.email_log import EmailLog
from services.resume_parser import parse_resume
from services.ai_service import get_ai_provider
from services.email_service import EmailService
from utils.file_helpers import allowed_file, get_upload_folder, safe_filename

candidates_bp = Blueprint('candidates', __name__)


@candidates_bp.route("/dashboard/jobs/<int:job_id>/upload-resumes", methods=["POST"])
@login_required
def upload_resumes(job_id):
    job = Job.query.get_or_404(job_id)
    if job.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    if 'resumes' not in request.files:
        return jsonify({'error': 'No files uploaded'}), 400

    files = request.files.getlist('resumes')

    existing_count = Candidate.query.filter_by(job_id=job_id).count()
    if existing_count + len(files) > 50:
        return jsonify({'error': f'Maximum 50 resumes per job. You have {existing_count} already.'}), 400

    upload_folder = get_upload_folder(current_app, job_id)
    results = []

    for file in files:
        if file and file.filename and allowed_file(file.filename):
            filename = safe_filename(file.filename)
            filepath = os.path.join(upload_folder, filename)
            file.save(filepath)

            try:
                with open(filepath, 'rb') as f:
                    raw_text = parse_resume(f, filename)

                candidate = Candidate(
                    job_id=job_id,
                    resume_filename=filename,
                    resume_path=filepath,
                    raw_text=raw_text,
                    status='pending'
                )
                db.session.add(candidate)
                results.append({'filename': filename, 'status': 'success'})
            except Exception as e:
                results.append({'filename': filename, 'status': 'failed', 'error': str(e)})
        elif file and file.filename:
            results.append({'filename': file.filename, 'status': 'failed', 'error': 'Unsupported file type'})

    db.session.commit()

    success_count = sum(1 for r in results if r['status'] == 'success')
    return jsonify({
        'message': f'Uploaded {success_count} of {len(files)} resumes',
        'results': results
    })


@candidates_bp.route("/dashboard/jobs/<int:job_id>/analyze", methods=["POST"])
@login_required
def analyze_candidates(job_id):
    job = Job.query.get_or_404(job_id)
    if job.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    candidates = Candidate.query.filter_by(job_id=job_id, status='pending').all()
    if not candidates:
        return jsonify({'error': 'No pending candidates to analyze'}), 400

    # Build job context for AI
    job_context = {
        'title': job.title,
        'field_category': job.field_category,
        'description': job.raw_description,
        'skills': job.parsed_skills,
        'experience': job.parsed_experience,
        'education': job.parsed_education,
        'requirements': job.parsed_requirements,
    }

    ai = get_ai_provider()
    results = []

    for candidate in candidates:
        if not candidate.raw_text:
            results.append({'id': candidate.id, 'status': 'skipped', 'reason': 'No resume text'})
            continue

        try:
            analysis = ai.analyze_resume(candidate.raw_text, job_context)

            # Update candidate info
            info = analysis.get('candidate_info', {})
            candidate.name = info.get('name') or candidate.name
            candidate.email = info.get('email') or candidate.email
            candidate.phone = info.get('phone') or candidate.phone

            # Update extracted data
            extracted = analysis.get('extracted_data', {})
            candidate.skills = json.dumps(extracted.get('skills', []))
            candidate.education = json.dumps(extracted.get('education', []))
            candidate.experience_summary = extracted.get('experience_summary', '')
            candidate.years_of_experience = extracted.get('years_of_experience')

            # AI summary
            candidate.ai_summary = analysis.get('ai_summary', '')

            # Scores
            scores = analysis.get('scores', {})
            existing_score = CandidateScore.query.filter_by(candidate_id=candidate.id).first()
            if existing_score:
                db.session.delete(existing_score)
                db.session.flush()

            score = CandidateScore(
                candidate_id=candidate.id,
                overall_score=scores.get('overall', 0),
                skills_score=scores.get('skills_match', 0),
                experience_score=scores.get('experience_match', 0),
                education_score=scores.get('education_match', 0),
                field_relevance_score=scores.get('field_relevance', 0),
                tier=analysis.get('tier', 'Weak'),
                scoring_rationale=analysis.get('scoring_rationale', '')
            )
            db.session.add(score)

            candidate.status = 'screened'
            results.append({'id': candidate.id, 'name': candidate.name, 'status': 'success',
                          'score': scores.get('overall', 0)})

        except Exception as e:
            results.append({'id': candidate.id, 'status': 'failed', 'error': str(e)})

    db.session.commit()
    return jsonify({'message': f'Analyzed {len(results)} candidates', 'results': results})


@candidates_bp.route("/dashboard/candidates/<int:candidate_id>")
@login_required
def candidate_detail(candidate_id):
    candidate = Candidate.query.get_or_404(candidate_id)
    job = Job.query.get_or_404(candidate.job_id)
    if job.user_id != current_user.id:
        flash("Unauthorized access.")
        return redirect(url_for('dashboard.dashboard_home'))

    skills = []
    if candidate.skills:
        try:
            skills = json.loads(candidate.skills)
        except (json.JSONDecodeError, TypeError):
            pass

    education = []
    if candidate.education:
        try:
            education = json.loads(candidate.education)
        except (json.JSONDecodeError, TypeError):
            pass

    return render_template("dashboard/candidate_detail.html",
                           logged_in=True,
                           active_page="candidates",
                           candidate=candidate,
                           job=job,
                           skills=skills,
                           education=education)


@candidates_bp.route("/dashboard/candidates/<int:candidate_id>/status", methods=["POST"])
@login_required
def update_candidate_status(candidate_id):
    candidate = Candidate.query.get_or_404(candidate_id)
    job = Job.query.get_or_404(candidate.job_id)
    if job.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    new_status = request.json.get('status')
    valid_statuses = ['pending', 'screened', 'shortlisted', 'interview_sent', 'interviewed', 'hired', 'rejected']
    if new_status not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400

    candidate.status = new_status
    db.session.commit()
    return jsonify({'status': candidate.status})


@candidates_bp.route("/dashboard/candidates/bulk-status", methods=["POST"])
@login_required
def bulk_update_status():
    data = request.json
    candidate_ids = data.get('candidate_ids', [])
    new_status = data.get('status')

    valid_statuses = ['shortlisted', 'rejected', 'hired']
    if new_status not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400

    updated = 0
    for cid in candidate_ids:
        candidate = Candidate.query.get(cid)
        if candidate:
            job = Job.query.get(candidate.job_id)
            if job and job.user_id == current_user.id:
                candidate.status = new_status
                updated += 1

    db.session.commit()
    return jsonify({'message': f'Updated {updated} candidates', 'status': new_status})


@candidates_bp.route("/dashboard/candidates/<int:candidate_id>/send-interview", methods=["POST"])
@login_required
def send_interview_email(candidate_id):
    candidate = Candidate.query.get_or_404(candidate_id)
    job = Job.query.get_or_404(candidate.job_id)
    if job.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    if not candidate.email:
        return jsonify({'error': 'Candidate has no email address'}), 400

    email_service = EmailService()
    company_name = current_user.company_name or 'Our Company'

    success, error_msg = email_service.send_interview_invitation(
        candidate_email=candidate.email,
        candidate_name=candidate.name or 'Candidate',
        job_title=job.title,
        company_name=company_name
    )

    # Log the email
    log = EmailLog(
        candidate_id=candidate.id,
        email_type='interview_invitation',
        recipient_email=candidate.email,
        subject=f"Interview Invitation - {job.title} at {company_name}",
        body=f"Interview invitation sent to {candidate.name}",
        status='sent' if success else 'failed',
        error_message=error_msg if not success else None
    )
    db.session.add(log)

    if success:
        candidate.status = 'interview_sent'
        candidate.interview_sent_at = datetime.utcnow()

    db.session.commit()

    if success:
        return jsonify({'message': f'Interview invitation sent to {candidate.email}'})
    else:
        return jsonify({'error': f'Failed to send email: {error_msg}'}), 500


@candidates_bp.route("/dashboard/candidates/bulk-send-interview", methods=["POST"])
@login_required
def bulk_send_interview():
    data = request.json
    candidate_ids = data.get('candidate_ids', [])

    email_service = EmailService()
    company_name = current_user.company_name or 'Our Company'
    results = []

    for cid in candidate_ids:
        candidate = Candidate.query.get(cid)
        if not candidate:
            continue

        job = Job.query.get(candidate.job_id)
        if not job or job.user_id != current_user.id:
            continue

        if not candidate.email:
            results.append({'id': cid, 'status': 'failed', 'error': 'No email'})
            continue

        success, error_msg = email_service.send_interview_invitation(
            candidate_email=candidate.email,
            candidate_name=candidate.name or 'Candidate',
            job_title=job.title,
            company_name=company_name
        )

        log = EmailLog(
            candidate_id=candidate.id,
            email_type='interview_invitation',
            recipient_email=candidate.email,
            subject=f"Interview Invitation - {job.title} at {company_name}",
            body=f"Interview invitation sent to {candidate.name}",
            status='sent' if success else 'failed',
            error_message=error_msg if not success else None
        )
        db.session.add(log)

        if success:
            candidate.status = 'interview_sent'
            candidate.interview_sent_at = datetime.utcnow()
            results.append({'id': cid, 'status': 'sent'})
        else:
            results.append({'id': cid, 'status': 'failed', 'error': error_msg})

    db.session.commit()
    sent_count = sum(1 for r in results if r['status'] == 'sent')
    return jsonify({'message': f'Sent {sent_count} of {len(candidate_ids)} emails', 'results': results})


@candidates_bp.route("/dashboard/candidates/<int:candidate_id>/delete", methods=["POST"])
@login_required
def delete_candidate(candidate_id):
    candidate = Candidate.query.get_or_404(candidate_id)
    job = Job.query.get_or_404(candidate.job_id)
    if job.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    job_id = candidate.job_id

    # Remove the file
    if candidate.resume_path and os.path.exists(candidate.resume_path):
        os.remove(candidate.resume_path)

    db.session.delete(candidate)
    db.session.commit()
    return jsonify({'message': 'Candidate deleted', 'job_id': job_id})


@candidates_bp.route("/dashboard/candidates")
@login_required
def candidates_list():
    """Global candidates view across all jobs."""
    user_job_ids = [j.id for j in Job.query.filter_by(user_id=current_user.id).all()]
    candidates = []
    if user_job_ids:
        candidates = Candidate.query.filter(
            Candidate.job_id.in_(user_job_ids)
        ).order_by(Candidate.created_at.desc()).all()

    total = len(candidates)
    shortlisted = sum(1 for c in candidates if c.status == 'shortlisted')
    pending = sum(1 for c in candidates if c.status == 'pending')
    hired = sum(1 for c in candidates if c.status == 'hired')

    return render_template("dashboard/candidates.html",
                           logged_in=True,
                           active_page="candidates",
                           candidates=candidates,
                           total=total,
                           shortlisted=shortlisted,
                           pending=pending,
                           hired=hired)
