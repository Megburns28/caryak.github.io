from pydantic import BaseSettings, EmailStr
from dotenv import load_dotenv
import os

class Settings(BaseSettings):
    JWT_PUBLIC_KEY: str
    JWT_PRIVATE_KEY: str
    REFRESH_TOKEN_EXPIRES_IN: int = int(os.getenv("REFRESH_TOKEN_EXPIRES_IN", 60))
    ACCESS_TOKEN_EXPIRES_IN: int = int(os.getenv("ACCESS_TOKEN_EXPIRES_IN", 15))
    JWT_ALGORITHM: str

    CLIENT_ORIGIN: str

    EMAIL_HOST: str
    EMAIL_PORT: int = int(os.getenv("EMAIL_PORT", 587))
    EMAIL_USERNAME: str
    EMAIL_PASSWORD: str
    EMAIL_FROM: EmailStr

    class Config:
        env_file = './.env'

# Load environment variables from the .env file
load_dotenv()

settings = Settings()
