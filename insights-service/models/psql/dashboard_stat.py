from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    DateTime,
    JSON,
    ForeignKey,
)
from datetime import datetime
from sqlalchemy.orm import relationship
from config.base import Base


class DashboardStat(Base):
    __tablename__ = "dashboard_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # Balance and cash flow
    total_balance = Column(Float, default=0)
    month_income = Column(Float, default=0)
    month_expenses = Column(Float, default=0)
    month_savings = Column(Float, default=0)
    savings_rate = Column(Float, default=0)

    # Previous month data
    prev_month_income = Column(Float, default=0)
    prev_month_expenses = Column(Float, default=0)
    prev_month_savings = Column(Float, default=0)

    # Change percentages
    income_change = Column(Float, default=0)
    spending_change = Column(Float, default=0)
    net_change = Column(Float, default=0)

    # Daily average
    avg_daily_spending = Column(Float, default=0)
    days_tracked = Column(Integer, default=0)

    # Bills
    upcoming_bills_total = Column(Float, default=0)
    paid_bills_total = Column(Float, default=0)

    # Categories
    largest_expense_category = Column(String, default="Unknown")
    largest_expense_amount = Column(Float, default=0)
    top_categories = Column(JSON, default=lambda: [])
    top_income_sources = Column(JSON, default=lambda: [])

    # Weekly patterns
    spending_by_day = Column(JSON, default=lambda: {})

    # Monthly trends
    spending_trends = Column(JSON, default=lambda: {})
    income_trends = Column(JSON, default=lambda: {})

    # Statistical metrics
    monthly_avg_income = Column(Float, default=0)
    monthly_avg_spending = Column(Float, default=0)
    income_stability = Column(Float, default=0)

    # Goals
    goals_on_track = Column(Integer, default=0)
    goals_at_risk = Column(Integer, default=0)
    total_goals = Column(Integer, default=0)

    # Budgets
    total_budgets = Column(Integer, default=0)
    total_budgeted = Column(Float, default=0)
    total_spent = Column(Float, default=0)

    # Period
    period_start = Column(DateTime)
    period_end = Column(DateTime)

    user = relationship("User", back_populates="dashboard_stats")
