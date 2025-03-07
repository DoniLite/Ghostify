from typing import Mapping, Any, Optional
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
    params: Optional[Mapping[str, Any]] = None,
    data: Optional[Any] = None,
    files: Optional[Mapping[str, Any]] = None,
    json: Optional[Any] = None,
    method: HttpMethods = HttpMethods.GET,
    header_params: Optional[Mapping[str, str]] = None,
) -> Response:
    async with AsyncClient() as client:
        try:
            if method == HttpMethods.GET:
                response = await client.get(url=url, params=params, headers=header_params)
            elif method == HttpMethods.POST:
                if json is not None:
                    response = await client.post(url=url, json=json, headers=header_params)
                elif files is not None and data is not None:
                    response = await client.post(url=url, data=data, files=files, headers=header_params)
                elif files is not None:
                    response = await client.post(url=url, files=files, headers=header_params)
                elif data is not None:
                    response = await client.post(url=url, data=data, headers=header_params)
                else:
                    response = await client.post(url=url, headers=header_params)
            elif method == HttpMethods.PUT:
                response = await client.put(url=url, json=json, headers=header_params)
            elif method == HttpMethods.DELETE:
                response = await client.delete(url=url, params=params, headers=header_params)
            elif method == HttpMethods.PATCH:
                response = await client.patch(url=url, json=json, headers=header_params)
            elif method == HttpMethods.HEAD:
                response = await client.head(url=url, params=params, headers=header_params)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except Exception as e:
            # Optionally, you might want to log the error or handle it differently
            raise