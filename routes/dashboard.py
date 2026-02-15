from flask import Blueprint, render_template
from flask_login import login_required, current_user
from extensions import db
from models.job import Job
from models.candidate import Candidate

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route("/dashboard")
@login_required
def dashboard_home():
    # Real stats from database
    active_jobs = Job.query.filter_by(user_id=current_user.id, status='active').count()
    total_jobs = Job.query.filter_by(user_id=current_user.id).count()

    # Get all job IDs for this user
    user_job_ids = [j.id for j in Job.query.filter_by(user_id=current_user.id).all()]

    total_candidates = 0
    pending_review = 0
    interviews_scheduled = 0
    if user_job_ids:
        total_candidates = Candidate.query.filter(Candidate.job_id.in_(user_job_ids)).count()
        pending_review = Candidate.query.filter(
            Candidate.job_id.in_(user_job_ids),
            Candidate.status == 'pending'
        ).count()
        interviews_scheduled = Candidate.query.filter(
            Candidate.job_id.in_(user_job_ids),
            Candidate.status.in_(['interview_sent', 'interviewed'])
        ).count()

    # Recent candidates for activity feed
    recent_candidates = []
    if user_job_ids:
        recent_candidates = Candidate.query.filter(
            Candidate.job_id.in_(user_job_ids)
        ).order_by(Candidate.created_at.desc()).limit(10).all()

    return render_template("dashboard/dashboard.html",
                           logged_in=True,
                           active_page="dashboard",
                           active_jobs=active_jobs,
                           total_candidates=total_candidates,
                           pending_review=pending_review,
                           interviews_scheduled=interviews_scheduled,
                           recent_candidates=recent_candidates,
                           total_jobs=total_jobs)


@dashboard_bp.route("/dashboard/analytics")
@login_required
def analytics():
    return render_template("dashboard/analytics.html", logged_in=True, active_page="analytics")


@dashboard_bp.route("/dashboard/settings")
@login_required
def settings():
    return render_template("dashboard/settings.html", logged_in=True, active_page="settings")
