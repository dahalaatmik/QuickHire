from extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, Float, DateTime, ForeignKey
from datetime import datetime


class Candidate(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    job_id: Mapped[int] = mapped_column(Integer, ForeignKey('job.id'), nullable=False)

    # Basic Info (extracted by AI)
    name: Mapped[str] = mapped_column(String(200), nullable=True)
    email: Mapped[str] = mapped_column(String(200), nullable=True)
    phone: Mapped[str] = mapped_column(String(50), nullable=True)

    # Resume Data
    resume_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    resume_path: Mapped[str] = mapped_column(String(500), nullable=False)
    raw_text: Mapped[str] = mapped_column(Text, nullable=True)

    # AI-Extracted Fields
    skills: Mapped[str] = mapped_column(Text, nullable=True)  # JSON list
    experience_summary: Mapped[str] = mapped_column(Text, nullable=True)
    education: Mapped[str] = mapped_column(Text, nullable=True)  # JSON
    years_of_experience: Mapped[float] = mapped_column(Float, nullable=True)

    # AI Analysis
    ai_summary: Mapped[str] = mapped_column(Text, nullable=True)

    # Status Workflow
    # pending -> screened -> shortlisted -> interview_sent -> interviewed -> hired -> rejected
    status: Mapped[str] = mapped_column(String(30), default='pending')

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    interview_sent_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # Relationship
    score = relationship('CandidateScore', backref='candidate', uselist=False, cascade='all, delete-orphan')


class CandidateScore(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    candidate_id: Mapped[int] = mapped_column(Integer, ForeignKey('candidate.id'), nullable=False)

    # Overall Score
    overall_score: Mapped[float] = mapped_column(Float, nullable=False)

    # Category Scores (each 0-100)
    skills_score: Mapped[float] = mapped_column(Float, nullable=True)
    experience_score: Mapped[float] = mapped_column(Float, nullable=True)
    education_score: Mapped[float] = mapped_column(Float, nullable=True)
    field_relevance_score: Mapped[float] = mapped_column(Float, nullable=True)

    # Tier Classification
    tier: Mapped[str] = mapped_column(String(20), nullable=True)  # Strong, Medium, Weak

    # AI Reasoning
    scoring_rationale: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
