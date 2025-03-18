from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    POSTGRES_URI: str
    MONGO_URI: str
    MONGO_DB_NAME: str

    class Config:
        env_file = ".env"


settings = Settings(_env_file=".env")
