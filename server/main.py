# main.py
from fastapi import FastAPI
from api.utils.database import DB
from fastapi.responses import JSONResponse

app = FastAPI()

if(DB.get_db() is not None):
    print("Connected to DB")
