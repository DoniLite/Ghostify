from typing import Union
from fastapi import FastAPI
import redis
from pydantic import BaseModel
import os

STATIC_DIR = os.path.abspath('../static')

app = FastAPI()
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}