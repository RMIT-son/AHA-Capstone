from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from bson.objectid import ObjectId
from util.db import collection

app = FastAPI()

class Record(BaseModel):
    name: str
    score: float

@app.get("/ping")
def ping():
    return {"message": "pong"}

@app.post("/records")
def add_record(record: Record):
    result = collection.insert_one(record.dict())
    return {"id": str(result.inserted_id)}

@app.get("/records", response_model=List[Record])
def get_records():
    records = collection.find()
    return [Record(name=r["name"], score=r["score"]) for r in records]

@app.get("/records/{name}")
def get_record(name: str):
    record = collection.find_one({"name": name})
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return Record(name=record["name"], score=record["score"])

@app.delete("/records/{name}")
def delete_record(name: str):
    result = collection.delete_one({"name": name})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"message": f"Record '{name}' deleted"}

@app.put("/records/{name}")
def update_record(name: str, record: Record):
    result = collection.update_one({"name": name}, {"$set": record.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"message": f"Record '{name}' updated"}
