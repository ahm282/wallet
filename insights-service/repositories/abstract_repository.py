from abc import ABC, abstractmethod
from sqlalchemy.orm import Session
from typing import Type, TypeVar, Generic

T = TypeVar("T")


class AbstractRepository(ABC, Generic[T]):
    @abstractmethod
    def get(self, db: Session, id: str) -> T:
        pass

    @abstractmethod
    def get_all(self, db: Session) -> list[T]:
        pass

    @abstractmethod
    def create(self, db: Session, obj_in: T) -> T:
        pass

    @abstractmethod
    def update(self, db: Session, db_obj: T, obj_in: dict) -> T:
        pass

    @abstractmethod
    def delete(self, db: Session, id: str) -> T:
        pass