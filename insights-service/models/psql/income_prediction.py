from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from config.base import Base


class IncomePrediction(Base):
    __tablename__ = "income_predictions"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))

    # Prediction data
    month = Column(String)  # Format: YYYY-MM
    predicted_income = Column(Float)
    confidence = Column(Float)

    # Prediction metadata
    prediction_date = Column(DateTime)  # When the prediction was made

    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    user = relationship("User", back_populates="income_predictions")
