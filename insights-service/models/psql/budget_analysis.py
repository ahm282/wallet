from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    DateTime,
    ForeignKey,
)
from datetime import datetime
from sqlalchemy.orm import relationship
from config.base import Base


class BudgetAnalysis(Base):
    __tablename__ = "budget_analysis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    budget_id = Column(String, index=True)
    name = Column(String)
    budgeted = Column(Float, default=0)
    spent = Column(Float, default=0)
    remaining = Column(Float, default=0)
    percentage_used = Column(Float, default=0)
    status = Column(String)  # "on_track", "overspent", "at_risk"
    period_start = Column(DateTime)
    period_end = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    user = relationship("User", back_populates="budget_analyses")
