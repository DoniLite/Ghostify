from datetime import datetime, timedelta, timezone
from typing import Union
import jwt


SECRET_KEY = '9d1026adfca0e3f93d7b9d7c3959e44fbd647efce0f7bfba8b4ede73a20801b0'
ALGORITHM = 'HS256'

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=float(15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt