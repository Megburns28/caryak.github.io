from pydantic import BaseSettings, EmailStr
import os
from dotenv import load_dotenv

class Settings(BaseSettings):

    #TODO: Look for a better way to load these
    # Load environment variables from the .env file
    load_dotenv()

    # Get environment variables
    DB_USERNAME = os.getenv("DB_USERNAME")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_PORT = os.getenv("DB_PORT")  
    DB_HOST = os.getenv("DB_HOST")
    DB_DATABASE = os.getenv("DB_DATABASE")

    SSL_CERT_PATH = os.path.join(os.path.dirname(__file__), 'rds-combined-ca-bundle.pem')

    # Create the MongoDB connection URI
    DATABASE_URI = (f"mongodb://{DB_USERNAME}:{DB_PASSWORD}@"
        f"{DB_HOST}:{DB_PORT}/{DB_DATABASE}"
        f"?tls=true&tlsCAFile={SSL_CERT_PATH}&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
    )

    DB_DATABASE: str

    JWT_PUBLIC_KEY: str
    JWT_PRIVATE_KEY: str
    REFRESH_TOKEN_EXPIRES_IN: int
    ACCESS_TOKEN_EXPIRES_IN: int
    JWT_ALGORITHM: str

    CLIENT_ORIGIN: str

    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_USERNAME: str
    EMAIL_PASSWORD: str
    # EMAIL_FROM: EmailStr     #TODO: Resolve issue with EmailStr
    EMAIL_FROM: str

    class Config:
        env_file = './.env'


settings = Settings()
