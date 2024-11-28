from datetime import datetime, timedelta, timezone
import json
import os
from typing import Union
from fastapi import HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from pydantic import BaseModel


SECRET_KEY = "9d1026adfca0e3f93d7b9d7c3959e44fbd647efce0f7bfba8b4ede73a20801b0"
ALGORITHM = "HS256"


class TokenModel(BaseModel):
    id: int
    token: str
    registration: str
    apiCredits: int
    cvCredits: int
    posterCredits: int


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(datetime.timezone.utc) + datetime.timedelta(
            minutes=float(15)
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)

        # Vérifier le schéma du token
        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid authorization code.",
            )

        # Vérifier le token
        if not self.verify_jwt(credentials.credentials):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid token or expired token.",
            )

        return credentials.credentials

    def verify_jwt(self, token: str):
        try:
            # Décode et vérifie le token
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

            # Vous pouvez ajouter des vérifications supplémentaires ici
            # Par exemple, vérifier l'expiration, les claims, etc.

            return True
        except jwt.PyJWTError:
            return False


def decode_token(token: str) -> TokenModel:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Extrait les données du token
        user_id = payload.get("id")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )

        return TokenModel(id=user_id)
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )


class InternalJWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)

        # Vérifier le schéma du token
        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid authorization code.",
            )

        # Vérifier le token
        if not self.verify_jwt(credentials.credentials):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid token or expired token.",
            )

        return credentials.credentials

    def verify_jwt(self, token: str) -> bool:
        # Définir le chemin absolu du fichier de sécurité
        security_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../../security")
        )
        security_file = os.path.join(security_dir, "security.json")

        # Vérification de l'existence du fichier de sécurité
        if not os.path.exists(security_file):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="The security file does not exist",
            )

        # Chargement des données de sécurité
        try:
            with open(security_file, "r") as f:
                security_data = json.load(f)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="The security file is invalid",
            )

        # Comparaison du hash dans les données et du token fourni
        if security_data.get("hash") != token:
            return False

        return True
