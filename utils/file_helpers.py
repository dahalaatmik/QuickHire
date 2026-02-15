import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'pdf', 'docx'}


def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_upload_folder(app, job_id: int) -> str:
    folder = os.path.join(app.config.get('UPLOAD_FOLDER', 'static/uploads'), 'resumes', str(job_id))
    os.makedirs(folder, exist_ok=True)
    return folder


def safe_filename(filename: str) -> str:
    return secure_filename(filename)
