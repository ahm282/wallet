from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from config.base import Base


class BudgetAnalysis(Base):
    __tablename__ = "budget_analyses"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))

    # Budget data
    name = Column(String)
    budgeted = Column(Float)
    spent = Column(Float)
    remaining = Column(Float)
    percentage_used = Column(Float)
    status = Column(String)  # on_track, warning, overspent

    # budget ID from MongoDB
    budget_id = Column(String)

    # Time period
    period_start = Column(DateTime)
    period_end = Column(DateTime)

    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    user = relationship("User", back_populates="budget_analyses")
