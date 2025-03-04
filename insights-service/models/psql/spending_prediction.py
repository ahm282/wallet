from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from datetime import datetime
from config.base import Base
from sqlalchemy.orm import relationship


class SpendingPrediction(Base):
    __tablename__ = "spending_predictions"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))

    # Prediction data
    month = Column(String)  # Format: YYYY-MM
    predicted_spending = Column(Float)
    confidence = Column(Float)
    categories = Column(JSON)  # List of category predictions

    # Prediction metadata
    prediction_date = Column(DateTime)  # When the prediction was made

    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # Relationship to User (optional)
    user = relationship("User", back_populates="spending_predictions")
