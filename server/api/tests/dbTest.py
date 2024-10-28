# dbTest.py
from api.utils.database import DB

if(DB.get_db() is not None):
    print("Connected to DB")
