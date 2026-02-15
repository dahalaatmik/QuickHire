from extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey
from datetime import datetime


class Job(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('user.id'), nullable=False)

    # Job Details
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    raw_description: Mapped[str] = mapped_column(Text, nullable=False)

    # AI-Parsed Fields
    parsed_skills: Mapped[str] = mapped_column(Text, nullable=True)  # JSON list
    parsed_experience: Mapped[str] = mapped_column(Text, nullable=True)  # JSON
    parsed_education: Mapped[str] = mapped_column(Text, nullable=True)  # JSON
    parsed_requirements: Mapped[str] = mapped_column(Text, nullable=True)  # JSON
    field_category: Mapped[str] = mapped_column(String(100), nullable=True)

    # Status
    status: Mapped[str] = mapped_column(String(20), default='draft')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, onupdate=datetime.utcnow, nullable=True)

    # Relationships
    candidates = relationship('Candidate', backref='job', lazy=True, cascade='all, delete-orphan')
