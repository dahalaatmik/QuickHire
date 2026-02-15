from flask import Blueprint, send_file
from flask_login import login_required, current_user
from models.job import Job
from models.candidate import Candidate
from services.pdf_export_service import generate_candidate_pdf, generate_job_report_pdf

exports_bp = Blueprint('exports', __name__)


@exports_bp.route("/dashboard/jobs/<int:job_id>/export")
@login_required
def export_job_report(job_id):
    job = Job.query.get_or_404(job_id)
    if job.user_id != current_user.id:
        return "Unauthorized", 403

    # Get hired/shortlisted candidates for this job
    candidates = Candidate.query.filter(
        Candidate.job_id == job_id,
        Candidate.status.in_(['hired', 'shortlisted', 'interview_sent', 'interviewed'])
    ).all()

    if not candidates:
        # Fall back to all screened candidates
        candidates = Candidate.query.filter(
            Candidate.job_id == job_id,
            Candidate.status != 'pending'
        ).all()

    candidates.sort(key=lambda c: c.score.overall_score if c.score else 0, reverse=True)

    pdf_buffer = generate_job_report_pdf(job, candidates)
    safe_title = job.title.replace(' ', '_')[:30]
    return send_file(pdf_buffer, mimetype='application/pdf',
                     as_attachment=True, download_name=f'{safe_title}_report.pdf')


@exports_bp.route("/dashboard/candidates/<int:candidate_id>/export")
@login_required
def export_candidate(candidate_id):
    candidate = Candidate.query.get_or_404(candidate_id)
    job = Job.query.get_or_404(candidate.job_id)
    if job.user_id != current_user.id:
        return "Unauthorized", 403

    pdf_buffer = generate_candidate_pdf(candidate, job)
    safe_name = (candidate.name or 'candidate').replace(' ', '_')[:30]
    return send_file(pdf_buffer, mimetype='application/pdf',
                     as_attachment=True, download_name=f'{safe_name}_report.pdf')
