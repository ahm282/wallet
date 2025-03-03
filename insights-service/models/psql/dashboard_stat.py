from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship
from config.base import Base


class DashboardStat(Base):
    __tablename__ = "dashboard_stats"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))

    # Balance data
    total_balance = Column(Float)
    month_income = Column(Float)
    month_expenses = Column(Float)
    month_savings = Column(Float)
    savings_rate = Column(Float)

    # Bill and expense data
    upcoming_bills_total = Column(Float)
    largest_expense_category = Column(String)
    largest_expense_amount = Column(Float)

    # Goal tracking
    goals_on_track = Column(Integer)
    goals_at_risk = Column(Integer)

    # Time period
    period_start = Column(DateTime)
    period_end = Column(DateTime)

    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    user = relationship("User", back_populates="dashboard_stats")
