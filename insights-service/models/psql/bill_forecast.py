from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    DateTime,
    Boolean,
    ForeignKey,
)
from datetime import datetime
from sqlalchemy.orm import relationship
from config.base import Base


class BillForecast(Base):
    __tablename__ = "bill_forecast"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)

    # Bill data
    bill_id = Column(String, index=True)  # bill ID from MongoDB
    payee = Column(String)
    amount = Column(Float, default=0)
    due_date = Column(DateTime)
    days_remaining = Column(Integer, default=0)
    recurring = Column(Boolean, default=False)

    # Forecast period
    forecast_date = Column(DateTime)  # When the forecast was created

    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    user = relationship("User", back_populates="bill_forecasts")
