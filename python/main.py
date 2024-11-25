from datetime import datetime
from typing import Any, Union
from fastapi import FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pypandoc import get_pandoc_path
import redis
from pydantic import BaseModel
from python.utils.pandoc_utils import InputFormats, OutputFormats, get_supported_formats
from python.utils.security import create_access_token
from .utils.pandoc_downloader import download_pandoc_binary
import jwt
from jwt.exceptions import InvalidTokenError
import os

STATIC_DIR = os.path.abspath('../static')
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

try:
    pandoc_path = get_pandoc_path()
    print(f'pandoc binary successfully found {pandoc_path}')
except OSError:
    print("Pandoc not found, trying to download it.")
    download_pandoc_binary()

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenModel(BaseModel):
    id: int
    token: str
    registration: str
    apiCredits: int
    cvCredits: int
    posterCredits: int
    
class ParserModel(BaseModel):
    input_formats: Union[list[InputFormats], Any]
    output_formats: Union[list[OutputFormats], Any]

app = FastAPI()
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get('/parser/{path}:path')
async def doc_parser(path: str):
    print(path)
    
@app.get('/available_formats')
async def parser_available_formats() -> ParserModel:
    # Récupérer les formats supportés par pandoc
    input_formats, output_formats = get_supported_formats()
    
    # Retourner les formats
    return ParserModel(input_formats=input_formats, output_formats=output_formats)
    


@app.post('/token')
async def get_token(token_payload: TokenModel) -> Token:
    # Copier les données valides du payload
    data_payload = token_payload.dict()

    # Convertir la date de registration en objet datetime
    try:
        registration_date = datetime.fromisoformat(data_payload["registration"])
    except ValueError:
        return {"error": "Invalid date format for 'registration'."}

    # Vérifier si la date est passée
    if datetime.now() > registration_date:
        delta = registration_date
    else:
        delta = None

    # Créer le token
    token = create_access_token(data_payload, delta)

    # Retourner le token
    return Token(access_token=token, token_type="bearer")


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}