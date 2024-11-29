from typing import Mapping, Any
from enum import Enum
from httpx import AsyncClient, Response


# Définition des méthodes HTTP
class HttpMethods(str, Enum):
    POST = "POST"
    GET = "GET"
    PUT = "PUT"
    DELETE = "DELETE"
    PATCH = "PATCH"
    HEAD = "HEAD"


# Fonction asynchrone pour effectuer des requêtes HTTP
async def requester(
    url: str,
    params: Mapping[str, Any] = None,
    data: Any = None,
    files: Mapping[str, Any] = None,
    json: Any = None,
    method: HttpMethods = HttpMethods.GET,
) -> Response:
    async with AsyncClient() as client:
        if method == HttpMethods.GET:
            response = await client.get(url=url, params=params)
        elif method == HttpMethods.POST:
            if json:
                response = await client.post(url=url, json=json)
            if data and files:
                response = await client.post(url=url, data=data, files=files)
            elif files:
                response = await client.post(url=url, files=files)
            response = await client.post(url=url, data=data)
        elif method == HttpMethods.PUT:
            response = await client.put(url=url, json=json)
        elif method == HttpMethods.DELETE:
            response = await client.delete(url=url, params=params)
        elif method == HttpMethods.PATCH:
            response = await client.patch(url=url, json=json)
        elif method == HttpMethods.HEAD:
            response = await client.head(url=url, params=params)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
    return response
