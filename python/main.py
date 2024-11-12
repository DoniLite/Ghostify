from typing import Union
from fastapi import FastAPI
from pypandoc import get_pandoc_path
import redis
from pydantic import BaseModel
from .utils.pandoc_downloader import download_pandoc_binary
import os

STATIC_DIR = os.path.abspath('../static')

try:
    pandoc_path = get_pandoc_path()
    print(f'pandoc binary successfully found {pandoc_path}')
except OSError:
    print("Pandoc not found, trying to download it.")
    download_pandoc_binary()


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