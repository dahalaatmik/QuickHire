import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os


class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', 587))
        self.sender_email = os.getenv('SMTP_EMAIL')
        self.sender_password = os.getenv('SMTP_PASSWORD')

    def send_interview_invitation(self, candidate_email: str, candidate_name: str,
                                  job_title: str, company_name: str) -> tuple[bool, str]:
        subject = f"Interview Invitation - {job_title} at {company_name}"

        body = f"""Dear {candidate_name},

Congratulations! After reviewing your application for the {job_title} position at {company_name}, we are pleased to inform you that you have been selected to proceed to the interview stage.

We were impressed with your qualifications and would like to learn more about your experience. Our team will reach out shortly with available interview slots.

Please ensure you are prepared and available for the upcoming interview process.

Best regards,
{company_name} Hiring Team"""

        try:
            msg = MIMEMultipart()
            msg['From'] = self.sender_email
            msg['To'] = candidate_email
            msg['Subject'] = subject

            msg.attach(MIMEText(body, 'plain'))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(msg)

            return True, ""
        except Exception as e:
            return False, str(e)
