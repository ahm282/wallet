from models.psql.user import User
from .base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    def get_by_id(self, db, id):
        return db.query(User).filter(User.id == id).first()
