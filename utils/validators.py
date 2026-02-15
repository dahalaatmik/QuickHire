import re


def validate_email(email: str) -> bool:
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_job_form(title: str, description: str) -> list[str]:
    errors = []
    if not title or not title.strip():
        errors.append("Job title is required.")
    if not description or not description.strip():
        errors.append("Job description is required.")
    if description and len(description.strip()) < 50:
        errors.append("Job description must be at least 50 characters.")
    return errors
