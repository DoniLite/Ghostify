from datetime import datetime
from random import randint
import shutil
from typing import Annotated, Any, Union
from fastapi import Body, Depends, FastAPI, File, HTTPException, Path, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, OAuth2PasswordBearer
from pypandoc import get_pandoc_path
import redis
from pydantic import BaseModel
from python.utils.functions import purge_files_after_transform, subscription_verify
from python.utils.pandoc_utils import (
    InputFormats,
    OutputFormats,
    convert_document,
    get_file_extension,
    get_supported_formats,
)
from python.utils.security import (
    InternalJWTBearer,
    JWTBearer,
    TokenModel,
    create_access_token,
    decode_token,
)
from python.utils.web_client import HttpMethods, requester
from .utils.pandoc_downloader import download_pandoc_binary
import os

STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../static"))
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

try:
    pandoc_path = get_pandoc_path()
    print(f"pandoc binary successfully found {pandoc_path}")
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
r = redis.Redis(host="localhost", port=6379, decode_responses=True)


class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None


@app.get("/")
def read_root():
    return {"Hello": "World"}


token_bearer = JWTBearer()

internal_bearer = InternalJWTBearer()


@app.post("/api/v1/parser")
async def parser(
    data: Annotated[ApiParserModel, Body],
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(token_bearer)],
):
    user = decode_token(credentials.credentials)
    user_access = await subscription_verify(user.id)
    if not user_access:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not subscribed.")
    random_number = randint(10000, 700000) + datetime.now().time().second
    random_numberv2 = random_number * randint(10, 70)
    input_ext = get_file_extension(data.ext)
    output_ext = get_file_extension(data.target)
    DIR = "/test"
    final_dir = os.path.join(STATIC_DIR, DIR)
    if input_ext:
        file_path = os.path.join(final_dir, f"{random_number}.{input_ext}")
    else:
        file_path = os.path.join(final_dir, f"{random_number}")
    if output_ext:
        file_pathv2 = os.path.join(final_dir, f"{random_numberv2}.{data.target}")
    else:
        file_pathv2 = os.path.join(final_dir, f"{random_numberv2}")
    try:
        with open(file_path, "x") as file:
            file.write(data.content)
        convert_document(
            input_file=file_path,
            output_file=file_pathv2,
            from_format=data.ext,
            to_format=data.target,
        )
        purge_files_after_transform(filename=file_path, dir=DIR)
        if data.api:
            with open(file_pathv2, "r") as f:
                content = f.read()
            return ApiParserResponseModel(success=True, data=content)
        else:
            query_params = {
                "user": user.id,
                "filePath": file_pathv2,
                "docType": output_ext,
            }
            server_path = "http://localhost:3085/api/v1/internal/doc"
            response = await requester(
                url=server_path, params=query_params, method=HttpMethods.GET
            )
            if response.status_code >= 400:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Internal Server Error occurred try again later",
                )
            response_payload = response.json().get("link")
            return ApiParserResponseModel(success=True, link=response_payload)

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail="something went wrong, please try again"
        )

@app.post("/uploadfile/")
async def create_upload_file(
    file: Annotated[UploadFile, File(description="A file read as UploadFile")],
):
    allowed_extensions = {"jpg", "jpeg", "png", "gif"}
    file_extension = file.filename.split(".")[-1].lower()
    
    if file_extension not in allowed_extensions:
        return {"error": "Invalid file type. Only images are allowed."}

    # Sauvegarder le fichier (comme dans l'exemple précédent)
    new_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    save_path = os.path.join(STATIC_DIR, new_filename)

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filename": new_filename, "path": save_path}

@app.get("/api/v1/parser/{path:path}")
async def doc_parser(
    path: Annotated[str, Path],
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(internal_bearer)],
):
    print(path)


@app.get("/api/v1/available_formats")
async def parser_available_formats() -> ParserModel:
    # Récupérer les formats supportés par pandoc
    input_formats, output_formats = get_supported_formats()

    # Retourner les formats
    return ParserModel(input_formats=input_formats, output_formats=output_formats)


@app.post("api/v1/token")
async def get_token(
    token_payload: Annotated[TokenModel, Body],
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(internal_bearer)],
) -> Token:
    # Copier les données valides du payload
    data_payload = token_payload.model_dump()

    # Convertir la date de registration en objet datetime
    try:
        registration_date = datetime.fromisoformat(data_payload["registration"])
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Invalid date format for 'registration'."
        )

    # Vérifier si la date est passée
    if datetime.now() > registration_date:
        delta = registration_date
    else:
        delta = None

    # Créer le token
    token = create_access_token(data_payload, delta)

    # Retourner le token
    return Token(access_token=token, token_type="bearer")
