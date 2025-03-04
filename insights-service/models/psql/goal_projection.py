from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from config.base import Base


class GoalProjection(Base):
    __tablename__ = "goal_projections"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))

    # Goal data
    goal_id = Column(String)  # goal ID from MongoDB
    name = Column(String)
    current = Column(Float)
    target = Column(Float)
    projected_completion_date = Column(DateTime, nullable=True)
    on_track = Column(Boolean)
    percentage_complete = Column(Float)
    recommended_monthly_contribution = Column(Float, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    user = relationship("User", back_populates="goal_projections")
