import PyPDF2
from docx import Document
import io


def extract_text_from_pdf(file_stream) -> str:
    reader = PyPDF2.PdfReader(file_stream)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text.strip()


def extract_text_from_docx(file_stream) -> str:
    doc = Document(file_stream)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text.strip()


def parse_resume(file, filename: str) -> str:
    extension = filename.lower().rsplit('.', 1)[-1] if '.' in filename else ''

    if extension == 'pdf':
        return extract_text_from_pdf(file)
    elif extension in ('docx', 'doc'):
        return extract_text_from_docx(file)
    else:
        raise ValueError(f"Unsupported file format: {extension}")
