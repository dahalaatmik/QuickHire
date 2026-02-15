import json
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user
from extensions import db
from models.job import Job
from models.candidate import Candidate
from utils.validators import validate_job_form
from services.ai_service import get_ai_provider

jobs_bp = Blueprint('jobs', __name__)


@jobs_bp.route("/dashboard/jobs")
@login_required
def jobs_list():
    jobs = Job.query.filter_by(user_id=current_user.id).order_by(Job.created_at.desc()).all()

    # Compute stats
    total_postings = len(jobs)
    open_now = sum(1 for j in jobs if j.status == 'active')
    draft_count = sum(1 for j in jobs if j.status == 'draft')
    closed_count = sum(1 for j in jobs if j.status == 'closed')

    return render_template("dashboard/jobs.html",
                           logged_in=True,
                           active_page="jobs",
                           jobs=jobs,
                           total_postings=total_postings,
                           open_now=open_now,
                           draft_count=draft_count,
                           closed_count=closed_count)


@jobs_bp.route("/dashboard/jobs/create", methods=["GET", "POST"])
@login_required
def job_create():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()

        errors = validate_job_form(title, description)
        if errors:
            for e in errors:
                flash(e)
            return render_template("dashboard/job_create.html",
                                   logged_in=True, active_page="jobs",
                                   title=title, description=description)

        # Create job first with raw data
        job = Job(
            user_id=current_user.id,
            title=title,
            raw_description=description,
            status='draft'
        )
        db.session.add(job)
        db.session.commit()

        # AI parse the job description
        try:
            ai = get_ai_provider()
            parsed = ai.parse_job_description(description)

            job.parsed_skills = json.dumps(parsed.get('required_skills', []) + parsed.get('preferred_skills', []))
            job.parsed_experience = json.dumps(parsed.get('experience', {}))
            job.parsed_education = json.dumps(parsed.get('education', {}))
            job.parsed_requirements = json.dumps(parsed.get('key_requirements', []))
            job.field_category = parsed.get('field_category', '')

            # Update title if AI found a better one and user left default
            if parsed.get('title') and not title:
                job.title = parsed['title']

            job.status = 'active'
            db.session.commit()
            flash("Job created and AI analysis complete!")
        except Exception as e:
            flash(f"Job saved but AI parsing failed: {str(e)}")
            db.session.commit()

        return redirect(url_for('jobs.job_detail', job_id=job.id))

    return render_template("dashboard/job_create.html",
                           logged_in=True, active_page="jobs")


@jobs_bp.route("/dashboard/jobs/<int:job_id>")
@login_required
def job_detail(job_id):
    job = Job.query.get_or_404(job_id)
    if job.user_id != current_user.id:
        flash("Unauthorized access.")
        return redirect(url_for('jobs.jobs_list'))

    candidates = Candidate.query.filter_by(job_id=job_id).all()
    # Sort by score descending if available
    candidates.sort(key=lambda c: c.score.overall_score if c.score else 0, reverse=True)

    # Parse stored JSON for display
    parsed_skills = []
    if job.parsed_skills:
        try:
            parsed_skills = json.loads(job.parsed_skills)
        except (json.JSONDecodeError, TypeError):
            pass

    parsed_requirements = []
    if job.parsed_requirements:
        try:
            parsed_requirements = json.loads(job.parsed_requirements)
        except (json.JSONDecodeError, TypeError):
            pass

    return render_template("dashboard/job_detail.html",
                           logged_in=True,
                           active_page="jobs",
                           job=job,
                           candidates=candidates,
                           parsed_skills=parsed_skills,
                           parsed_requirements=parsed_requirements)


@jobs_bp.route("/dashboard/jobs/<int:job_id>/status", methods=["POST"])
@login_required
def update_job_status(job_id):
    job = Job.query.get_or_404(job_id)
    if job.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    new_status = request.json.get('status')
    if new_status not in ('draft', 'active', 'closed'):
        return jsonify({'error': 'Invalid status'}), 400

    job.status = new_status
    db.session.commit()
    return jsonify({'status': job.status})


@jobs_bp.route("/dashboard/jobs/<int:job_id>/delete", methods=["POST"])
@login_required
def delete_job(job_id):
    job = Job.query.get_or_404(job_id)
    if job.user_id != current_user.id:
        flash("Unauthorized access.")
        return redirect(url_for('jobs.jobs_list'))

    db.session.delete(job)
    db.session.commit()
    flash("Job deleted.")
    return redirect(url_for('jobs.jobs_list'))
