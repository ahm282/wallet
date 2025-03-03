from sqlalchemy.orm import Session
from typing import Type, TypeVar, Generic
from .abstract_repository import AbstractRepository

T = TypeVar("T")


class BaseRepository(AbstractRepository[T], Generic[T]):
    def __init__(self, model: Type[T]):
        self.model = model

    def get(self, db: Session, id: str) -> T:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_all(self, db: Session) -> list[T]:
        return db.query(self.model).all()

    def create(self, db: Session, obj_in: T) -> T:
        db.add(obj_in)
        db.commit()
        db.refresh(obj_in)
        return obj_in

    def update(self, db: Session, db_obj: T, obj_in: dict) -> T:
        for key, value in obj_in.items():
            setattr(db_obj, key, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: str) -> T:
        obj = db.query(self.model).filter(self.model.id == id).first()
        db.delete(obj)
        db.commit()
        return obj

    def get_latest_for_user(self, db: Session, user_id: str) -> T:
        try:
            return (
                db.query(self.model)
                .filter(self.model.user_id == user_id)
                .order_by(self.model.created_at.desc())
                .first()
            )
        except Exception as e:
            print(f"Error in get_latest_for_user: {e}")
            return None
