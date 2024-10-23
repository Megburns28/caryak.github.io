# database.py
import os
from pymongo import MongoClient
from dotenv import load_dotenv

class DB:
    _client = None

    @classmethod
    def init(cls):
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
        connection_uri = (f"mongodb://{DB_USERNAME}:{DB_PASSWORD}@"
            f"{DB_HOST}:{DB_PORT}/{DB_DATABASE}"
            f"?tls=true&tlsCAFile={SSL_CERT_PATH}&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
        )

        # Initialize the MongoDB client
        cls._client = MongoClient(connection_uri)
        return cls._client[DB_DATABASE]

    @classmethod
    def get_db(cls):
        # Return the database if already initialized, otherwise initialize it
        if cls._client is None:
            return cls.init()
        return cls._client[os.getenv("DB_DATABASE")]
