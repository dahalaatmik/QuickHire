import json
import io
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable


def generate_candidate_pdf(candidate, job) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            topMargin=20 * mm, bottomMargin=20 * mm,
                            leftMargin=20 * mm, rightMargin=20 * mm)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title2', parent=styles['Title'], fontSize=18, spaceAfter=6)
    subtitle_style = ParagraphStyle('Subtitle2', parent=styles['Normal'], fontSize=11,
                                     textColor=colors.grey, spaceAfter=12)
    heading_style = ParagraphStyle('Heading', parent=styles['Heading2'], fontSize=13,
                                    spaceAfter=6, spaceBefore=12)
    body_style = styles['Normal']

    elements = []

    # Header
    name = candidate.name or 'Unknown Candidate'
    elements.append(Paragraph(name, title_style))
    elements.append(Paragraph(f"Applied for: {job.title}", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.lightgrey))
    elements.append(Spacer(1, 8))

    # Contact Info
    elements.append(Paragraph("Contact Information", heading_style))
    contact_data = []
    if candidate.email:
        contact_data.append(["Email", candidate.email])
    if candidate.phone:
        contact_data.append(["Phone", candidate.phone])
    if contact_data:
        t = Table(contact_data, colWidths=[80, 300])
        t.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.grey),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(t)
    elements.append(Spacer(1, 6))

    # Score Summary
    if candidate.score:
        elements.append(Paragraph("AI Assessment", heading_style))
        score_data = [
            ["Overall Score", f"{candidate.score.overall_score:.0f}/100"],
            ["Tier", candidate.score.tier or "N/A"],
            ["Skills Match", f"{candidate.score.skills_score:.0f}/100" if candidate.score.skills_score else "N/A"],
            ["Experience Match", f"{candidate.score.experience_score:.0f}/100" if candidate.score.experience_score else "N/A"],
            ["Education Match", f"{candidate.score.education_score:.0f}/100" if candidate.score.education_score else "N/A"],
            ["Field Relevance", f"{candidate.score.field_relevance_score:.0f}/100" if candidate.score.field_relevance_score else "N/A"],
        ]
        t = Table(score_data, colWidths=[120, 200])
        t.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.grey),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 6))

    # AI Summary
    if candidate.ai_summary:
        elements.append(Paragraph("AI Summary", heading_style))
        elements.append(Paragraph(candidate.ai_summary, body_style))
        elements.append(Spacer(1, 6))

    # Skills
    if candidate.skills:
        elements.append(Paragraph("Skills", heading_style))
        try:
            skills_list = json.loads(candidate.skills)
            elements.append(Paragraph(", ".join(skills_list), body_style))
        except (json.JSONDecodeError, TypeError):
            elements.append(Paragraph(str(candidate.skills), body_style))
        elements.append(Spacer(1, 6))

    # Education
    if candidate.education:
        elements.append(Paragraph("Education", heading_style))
        try:
            edu_list = json.loads(candidate.education)
            for edu in edu_list:
                if isinstance(edu, dict):
                    line = f"{edu.get('degree', '')} in {edu.get('field', '')} — {edu.get('institution', '')} ({edu.get('year', '')})"
                    elements.append(Paragraph(line, body_style))
                else:
                    elements.append(Paragraph(str(edu), body_style))
        except (json.JSONDecodeError, TypeError):
            elements.append(Paragraph(str(candidate.education), body_style))
        elements.append(Spacer(1, 6))

    # Experience Summary
    if candidate.experience_summary:
        elements.append(Paragraph("Experience Summary", heading_style))
        elements.append(Paragraph(candidate.experience_summary, body_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer


def generate_job_report_pdf(job, candidates) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            topMargin=20 * mm, bottomMargin=20 * mm,
                            leftMargin=15 * mm, rightMargin=15 * mm)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title2', parent=styles['Title'], fontSize=18, spaceAfter=6)
    subtitle_style = ParagraphStyle('Subtitle2', parent=styles['Normal'], fontSize=11,
                                     textColor=colors.grey, spaceAfter=12)
    heading_style = ParagraphStyle('Heading', parent=styles['Heading2'], fontSize=13,
                                    spaceAfter=6, spaceBefore=12)
    body_style = styles['Normal']

    elements = []

    # Header
    elements.append(Paragraph(f"Hiring Report: {job.title}", title_style))
    elements.append(Paragraph(f"Category: {job.field_category or 'N/A'} | Status: {job.status}", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.lightgrey))
    elements.append(Spacer(1, 10))

    # Summary stats
    elements.append(Paragraph("Summary", heading_style))
    elements.append(Paragraph(f"Total candidates exported: {len(candidates)}", body_style))
    elements.append(Spacer(1, 10))

    # Candidates table
    if candidates:
        table_data = [["#", "Name", "Email", "Score", "Tier", "Status"]]
        for i, c in enumerate(candidates, 1):
            score_val = f"{c.score.overall_score:.0f}" if c.score else "N/A"
            tier_val = c.score.tier if c.score else "N/A"
            table_data.append([
                str(i),
                c.name or "Unknown",
                c.email or "N/A",
                score_val,
                tier_val,
                c.status,
            ])

        t = Table(table_data, colWidths=[25, 100, 130, 45, 55, 70])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#22C55E')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F9F9F9')]),
        ]))
        elements.append(t)

    doc.build(elements)
    buffer.seek(0)
    return buffer
