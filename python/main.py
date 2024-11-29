from datetime import datetime
from enum import Enum
from random import randint
import shutil
from typing import Annotated, Any, Dict, List, Union
from fastapi import (
    Body,
    Depends,
    FastAPI,
    File,
    Form,
    HTTPException,
    Path,
    Query,
    UploadFile,
    status,
)
from fastapi.security import HTTPAuthorizationCredentials, OAuth2PasswordBearer
from fastapi.openapi.docs import get_swagger_ui_html
import httpx
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
from python.utils.pandoc_downloader import download_pandoc_binary
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

class ApiTags(str, Enum):
    PARSER = "parser"
    BLOG = "blog"
    INFO = "info"
    
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


class InternalParserResponseModel(BaseModel):
    success: bool
    path: str


class Section(BaseModel):
    index: int
    title: str
    content: str


class Image(BaseModel):
    img: Union[Any, None] = (
        None  # Représente `never` en TypeScript, peut être remplacé par `None` ou un autre type selon ton usage.
    )
    index: int
    section: int


class ListItem(BaseModel):
    item: str
    description: str
    index: int
    section: int


class ListEntry(BaseModel):
    index: int
    items: List[ListItem]


class DocumentStorage(BaseModel):
    title: str
    desc_or_meta: str
    section: List[Section]
    image: List[Image]
    list: Dict[str, List[ListEntry]]

class ServerResponseBlog(BaseModel):
    success: bool
    article: str
    
class BlogResponseModel(BaseModel):
    message: str
    response: ServerResponseBlog


app = FastAPI(
    title="Ghostify APIs",
    description="Ghostify est une plateforme multi-service de création d'articles, de CV et de conversion de documents. | Ghostify is a multi-service platform for creating articles, resumes and document conversion",
    version="1.0.0",
    terms_of_service="https://ghostify.site/terms/",
    contact={
        "name": "Doni",
        "url": "https://ghostify.site/license/",
        "email": "yaomessan13@outlook.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    docs_url="/documentation",
    redoc_url="/redoc-ui",
)
r = redis.Redis(host="localhost", port=6379, decode_responses=True)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/documentation", include_in_schema=False)
async def custom_docs():
    favicon = os.path.abspath(os.path.join(__file__, "../src/public/SVG/gostify.svg"))
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="Ghostify APIs Docs",
        swagger_favicon_url="https://ghostify.site/static/SVG/gostify.svg",  # URL de ton favicon
    )


token_bearer = JWTBearer()

internal_bearer = InternalJWTBearer()


@app.post("/api/v1/parser", tags=[ApiTags.PARSER])
async def parser(
    data: Annotated[ApiParserModel, Body],
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(token_bearer)],
):
    user = decode_token(credentials.credentials)
    user_access = await subscription_verify(user.id)
    if not user_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not subscribed."
        )
    random_number = datetime.now().strftime("%Y%m%d%H%M%S") + str(randint(10000, 90000))
    random_numberv2 = datetime.now().strftime("%Y%m%d%H%M%S") + str(
        randint(10000, 90000)
    )
    input_ext = get_file_extension(data.ext)
    output_ext = get_file_extension(data.target)
    DIR = "/test"
    DIRV2 = "downloads/doc"
    final_dir = os.path.join(STATIC_DIR, DIR)
    final_dirV2 = os.path.join(STATIC_DIR, DIRV2)
    if input_ext:
        file_path = os.path.join(final_dir, f"{random_number}.{input_ext}")
    else:
        file_path = os.path.join(final_dir, f"{random_number}")
    if output_ext:
        file_pathv2 = os.path.join(final_dirV2, f"{random_numberv2}.{data.target}")
    else:
        file_pathv2 = os.path.join(final_dirV2, f"{random_numberv2}")
    try:
        with open(file_path, "x") as file:
            file.write(data.content)
        convert_document(
            input_file=file_path,
            output_file=file_pathv2,
            from_format=data.ext,
            to_format=data.target,
        )
        purge_files_after_transform(file_path=file_path)
        if data.api:
            with open(file_pathv2, "r") as f:
                content = f.read()
            purge_files_after_transform(file_path=file_pathv2)
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


@app.post("/api/v1/parser/file", tags=[ApiTags.PARSER])
async def create_upload_file(
    file: Annotated[UploadFile, File(description="A file read as UploadFile")],
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(token_bearer)],
    out: Annotated[OutputFormats, Query],
    api: Annotated[Union[str, None], Query] = None,
) -> ApiParserResponseModel:
    user = decode_token(credentials.credentials)
    user_access = await subscription_verify(user.id)
    DIR = "/test"
    DIRV2 = "downloads/doc"
    if api:
        is_for_api = bool(api)

    if not user_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not subscribed."
        )

    file_extension = file.filename.split(".")[-1].lower()

    if file_extension not in InputFormats:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Invalid file extension this is not supported",
        )

    # Sauvegarder le fichier (comme dans l'exemple précédent)
    new_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    final_dir = os.path.join(STATIC_DIR, DIR)
    final_divV2 = os.path.join(STATIC_DIR, DIRV2)
    file_path = os.path.join(final_dir, new_filename)
    ext = get_file_extension(out)
    if ext:
        output_name = f"{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
    output_name = f"{datetime.now().strftime('%Y%m%d%H%M%S')}"
    file_pathV2 = os.path.join(final_divV2, output_name)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        convert_document(
            input_file=file_path,
            output_file=file_pathV2,
            from_format=file_extension,
            to_format=out,
        )

        if is_for_api:
            with open(file_pathV2, "r") as f:
                content = f.read()
            purge_files_after_transform(file_path=file_pathV2)
            return ApiParserResponseModel(success=True, data=content)
        query_params = {
            "user": user.id,
            "filePath": file_pathV2,
            "docType": ext,
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
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong please try again",
        )


@app.get("/api/v1/parser/{path:path}", include_in_schema=False)
async def doc_parser(
    path: Annotated[str, Path],
    out: Annotated[OutputFormats, Query],
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(internal_bearer)],
) -> InternalParserResponseModel:
    print(
        f"new communication request from internal client with {credentials.credentials}"
    )
    file_extension = path.split(".")[-1].lower()
    if file_extension not in InputFormats:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Invalid file extension this is not supported",
        )
    ext = get_file_extension(out)
    if ext:
        output_name = f"{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
    output_name = f"{datetime.now().strftime('%Y%m%d%H%M%S')}"
    DIR = "downloads/doc"
    final_dir = os.path.join(STATIC_DIR, DIR)
    file_pathV2 = os.path.join(final_dir, output_name)
    try:
        convert_document(
            input_file=path,
            output_file=file_pathV2,
            from_format=file_extension,
            to_format=out,
        )
        purge_files_after_transform(file_path=path)
        return InternalParserResponseModel(success=True, path=file_pathV2)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong please try again",
        )



@app.post("/api/v1/blog/create", tags=[ApiTags.BLOG])
async def save_document(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(token_bearer)],
    files: List[UploadFile] = File(...),
    data: str = Form(...),  # JSON data as string
    json_field: bool = Form(...),  # Additional boolean field
) -> BlogResponseModel:
    """
    Generate a blog content in HTML with the provided data.

    Args:
        files: List of files to upload
        data: JSON data as a string
        json_field: Additional boolean field

    Returns:
        Dict with success message and server response
    """
    user = decode_token(credentials.credentials)
    user_access = await subscription_verify(user.id)
    if not user_access:
        raise HTTPException(status_code=403, detail="User not authorized")
    EXPRESS_URL = "http://localhost:3085/poster/save"

    # Prepare multipart form data
    try:
        async with httpx.AsyncClient() as client:
            # Create multipart request manually
            form_data = {}

            # Add files
            multi_files = [
                (
                    "file",
                    (
                        file.filename,
                        file.file,
                        file.content_type or "application/octet-stream",
                    ),
                )
                for file in files
            ]

            # Add form fields
            form_data["data"] = data
            form_data["json"] = str(json_field).lower()

            # Send POST request to Express backend
            response = await client.post(EXPRESS_URL, files=multi_files, data=form_data)

        # Check response
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Express server error: {response.text}",
            )

        return BlogResponseModel(message="Document saved successfully", response=response.json())

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"HTTP request error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/api/v1/available_formats", tags=[ApiTags.INFO])
async def parser_available_formats() -> ParserModel:
    # Récupérer les formats supportés par pandoc
    input_formats, output_formats = get_supported_formats()

    # Retourner les formats
    return ParserModel(input_formats=input_formats, output_formats=output_formats)


@app.post("api/v1/token", include_in_schema=False)
async def get_token(
    token_payload: Annotated[TokenModel, Body],
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(internal_bearer)],
) -> Token:
    # Copier les données valides du payload
    data_payload = token_payload.model_dump()
    print(
        f"new operation for the {credentials.credentials} token with payload {data_payload}"
    )
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
