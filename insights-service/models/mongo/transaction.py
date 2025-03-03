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


class Category(str, Enum):
    Food = ("Food",)
    Groceries = "Groceries"
    Utilities = "Utilities"
    Entertainment = "Entertainment"
    Travel = "Travel"
    Health = "Health"
    Education = "Education"
    Shopping = "Shopping"
    Transportation = "Transportation"
    Rent = "Rent"
    Mortgage = "Mortgage"
    Insurance = "Insurance"
    Bills = "Bills"
    Savings = "Savings"
    PersonalCare = "Personal Care"
    Income = "Income"
    Housing = "Housing"
    DiningOut = "Dining Out"
    Subscriptions = "Subscriptions"
    Gifts = "Gifts"
    Other = "Other"


class TransactionModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    userId: str
    description: str
    date: int
    amount: float
    category: Optional[Category]
    createdAt: int
    updatedAt: int
    metadata: Dict[str, Any] = {}

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
