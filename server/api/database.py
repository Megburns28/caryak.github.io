from pymongo import mongo_client
import pymongo
from config import settings

client = mongo_client.MongoClient(settings.DATABASE_URI)
print('Connected to MongoDB...')

db = client[settings.DB_DATABASE]
User = db.users
Post = db.posts
User.create_index([("email", pymongo.ASCENDING)], unique=True)
Post.create_index([("title", pymongo.ASCENDING)], unique=True)
