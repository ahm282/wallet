from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from config.base import Base


class CashFlow(Base):
    __tablename__ = "cash_flows"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))

    # Cash flow data
    date = Column(DateTime)
    income = Column(Float)
    expenses = Column(Float)
    net = Column(Float)

    # Time period identifier
    period_type = Column(String)  # week, month, quarter, year
    period_id = Column(String)  # e.g., "2023-W01", "2023-01", etc.

    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # Relationship to User
    user = relationship("User", back_populates="cash_flows")
