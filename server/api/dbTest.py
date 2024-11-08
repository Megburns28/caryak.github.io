# dbTest.py
# from api.utils.database import DB

# if(DB.get_db() is not None):
#     print("Connected to DB")

from config import settings
from pymongo import MongoClient

# Initialize the MongoDB client
client = MongoClient(settings.DATABASE_URI)
x = client[settings.DB_DATABASE]
# print(x)
