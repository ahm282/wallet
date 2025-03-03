from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Any, Dict, Optional
from enum import Enum


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class RecurrenceFrequency(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"


class Recurrence(BaseModel):
    frequency: RecurrenceFrequency = RecurrenceFrequency.MONTHLY
    interval: int = 1
    endDate: Optional[int]


class BillModel(BaseModel):
    id: PyObjectId | str = Field(default_factory=PyObjectId, alias="_id")
    userId: str
    payee: str
    amount: float
    dueDate: int
    paidOn: Optional[int]
    paid: bool = False
    description: Optional[str]
    recurring: bool = False
    recurrence: Optional[Recurrence]
    createdAt: int
    updatedAt: int
    metadata: Dict[str, Any] = {}

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
