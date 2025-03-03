from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from config.base import Base


class BillForecast(Base):
    __tablename__ = "bill_forecasts"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))

    # Bill data
    bill_id = Column(String)  # bill ID from MongoDB
    payee = Column(String)
    amount = Column(Float)
    due_date = Column(DateTime)
    days_remaining = Column(Integer)
    recurring = Column(Boolean)

    # Forecast period
    forecast_date = Column(DateTime)  # When the forecast was created

    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    user = relationship("User", back_populates="bill_forecasts")
