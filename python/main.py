from datetime import datetime
from random import randint
from typing import Annotated, Any, Union
from fastapi import Body, Depends, FastAPI, HTTPException, Path, status
from fastapi.security import OAuth2PasswordBearer
from pypandoc import get_pandoc_path
import redis
from pydantic import BaseModel
from python.utils.functions import purge_files_after_transform
from python.utils.pandoc_utils import InputFormats, OutputFormats, convert_document, get_file_extension, get_supported_formats
from python.utils.security import JWTBearer, TokenModel, create_access_token, decode_token
from python.utils.web_client import HttpMethods, requester
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
    
class ParserModel(BaseModel):
    input_formats: Union[list[InputFormats], Any]
    output_formats: Union[list[OutputFormats], Any]
    
class ApiParserModel(BaseModel):
    ext: InputFormats
    target: OutputFormats
    content: str
    api: bool = False
    
class ApiParserResponseModel(BaseModel):
    success: bool
    data: Union[str, None] = None
    link: Union[str, None] = None

app = FastAPI()
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

@app.get("/")
def read_root():
    return {"Hello": "World"}
 
@app.post('/parser')
async def parser(data: Annotated[ApiParserModel, Body], token: Annotated[str, Depends(JWTBearer)]):
    random_number = randint(10000, 700000) + datetime.now().time().second
    random_numberv2 = random_number * randint(10, 70)
    input_ext = get_file_extension(data.ext)
    output_ext = get_file_extension(data.target)
    payload = decode_token(token)
    DIR = '/test'
    final_dir = os.path.join(STATIC_DIR, DIR)
    if input_ext:
        file_path = os.path.join(final_dir, f'{random_number}.{input_ext}')
    else:
        file_path = os.path.join(final_dir, f'{random_number}')
    if output_ext:
        file_pathv2 = os.path.join(final_dir, f'{random_numberv2}.{data.target}')
    else:
        file_pathv2 = os.path.join(final_dir, f'{random_numberv2}')
    try:
        with open(file_path, 'x') as file:
            file.write(data.content)
        convert_document(input_file=file_path, output_file=file_pathv2, from_format=data.ext, to_format=data.target)
        purge_files_after_transform(filename=file_path, dir=DIR)
        if data.api:
            with open(file_pathv2, 'r') as f:
                content = f.read()
            return ApiParserResponseModel(success=True, data=content)
        else:
            query_params = {
                "userId": payload.id, 
                "filePath": file_pathv2, 
                "docType": output_ext
            }
            server_path = "http://localhost:3085/api/v1/internal/doc"
            response = await requester(url=server_path, params=query_params, method=HttpMethods.GET)
            if response.status_code >= 400:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error occurred try again later")
            response_payload = response.json().get('link')
            return ApiParserResponseModel(success=True, link=response_payload)
            
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="something went wrong, please try again")


@app.get('/parser/{path}:path')
async def doc_parser(path: Annotated[str, Path]):
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
    data_payload = token_payload.model_dump()

    # Convertir la date de registration en objet datetime
    try:
        registration_date = datetime.fromisoformat(data_payload["registration"])
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format for 'registration'.")

    # Vérifier si la date est passée
    if datetime.now() > registration_date:
        delta = registration_date
    else:
        delta = None

    # Créer le token
    token = create_access_token(data_payload, delta)

    # Retourner le token
    return Token(access_token=token, token_type="bearer")

