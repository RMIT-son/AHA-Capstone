import os
from pymongo import MongoClient

# In local dev, load .env manually. In Docker, env vars are injected at runtime.
if os.getenv("ENV") != "docker":
    from dotenv import load_dotenv
    load_dotenv()

MONGO_URI = os.getenv("DATABASE")
if not MONGO_URI:
    raise Exception("Missing DATABASE environment variable")

client = MongoClient(MONGO_URI)
db = client["AHA-Capstone"]
collection = db["records"]
