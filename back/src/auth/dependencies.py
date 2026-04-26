import os
from dotenv import load_dotenv
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError

load_dotenv()
SECRET_KEY = os.environ.get("SECRET_KEY", "8e89816372df3a00951701a1a3fa4a0d0d4463fe0c511177253be2100d8c8150")
ALGORITHM = os.environ.get("ALGORITHM", "HS256")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None or (payload.get("type") != "access"):
            raise credentials_exception    
        return {
            "email": email,
            "id_user": payload.get("id_user")
        }
    except InvalidTokenError:
        raise credentials_exception