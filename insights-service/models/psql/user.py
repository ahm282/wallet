from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from config.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # Relationships
    insights = relationship(
        "Insight", back_populates="user", cascade="all, delete-orphan"
    )
    income_predictions = relationship(
        "IncomePrediction", back_populates="user", cascade="all, delete-orphan"
    )
    spending_predictions = relationship(
        "SpendingPrediction", back_populates="user", cascade="all, delete-orphan"
    )
    cash_flows = relationship(
        "CashFlow", back_populates="user", cascade="all, delete-orphan"
    )
    goal_projections = relationship(
        "GoalProjection", back_populates="user", cascade="all, delete-orphan"
    )
    bill_forecasts = relationship(
        "BillForecast", back_populates="user", cascade="all, delete-orphan"
    )
    analysis_jobs = relationship(
        "AnalysisJob", back_populates="user", cascade="all, delete-orphan"
    )
    budget_analyses = relationship(
        "BudgetAnalysis", back_populates="user", cascade="all, delete-orphan"
    )
    dashboard_stats = relationship(
        "DashboardStat", back_populates="user", cascade="all, delete-orphan"
    )
