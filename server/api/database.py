from pymongo import MongoClient
from dotenv import load_dotenv
import os
import pymongo
    

load_dotenv()

DB_HOST = os.getenv("DB_HOST")

try:
    client = MongoClient(DB_HOST)
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print("Connection Error:", e)

db = client["Caryak"]
User = db.users
Post = db.posts
Vote = db.votes
User.create_index([("email", pymongo.ASCENDING)], unique=True)
Post.create_index([("title", pymongo.ASCENDING)], unique=True)