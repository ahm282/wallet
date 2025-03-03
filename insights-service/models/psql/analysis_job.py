from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from config.base import Base
from .enums import AnalysisStatus


class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    status = Column(Enum(AnalysisStatus), default=AnalysisStatus.PENDING)
    job_type = Column(String)  # e.g., dashboard, spending, cashflow, etc.
    params = Column(JSON, nullable=True)
    result_id = Column(
        Integer, nullable=True
    )  # ID of the result in its respective table
    error = Column(String, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="analysis_jobs")
