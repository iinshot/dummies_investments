import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import jwt
import bcrypt
from sqlalchemy.ext.asyncio import AsyncSession
from crud.user import get_user_by_email
from models.User import User


load_dotenv()
SECRET_KEY = os.environ.get("SECRET_KEY", "8e89816372df3a00951701a1a3fa4a0d0d4463fe0c511177253be2100d8c8150")
ALGORITHM = os.environ.get("ALGORITHM", "HS256")

async def verify_password(password: str, salt: str, hashed_password: str) -> bool:
    password_hash = bcrypt.hashpw(password.encode(), salt.encode())
    return password_hash.decode() == hashed_password

async def authenticate_user(session: AsyncSession, email: str, password: str) -> User:
    user = await get_user_by_email(session, email)
    if not user:
        return False
    if not await verify_password(password, user.salt, user.password_hash):
        return False
    return user

async def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=999)
    to_encode.update({"type": "access", "exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def create_refresh_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"type": "refresh", "exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def refresh_access_token(session: AsyncSession, refresh_token: str) -> tuple[str, str]:
    payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
    if payload.get("type") != "refresh":
        raise ValueError("Invalid token type")
    
    email = payload.get("sub")
    
    if email is None:
        raise ValueError("Invalid token payload")
    
    user = await get_user_by_email(session, email)
    if user is None:
        raise ValueError("User not found")
    
    access_token = await create_access_token(data={"sub": user.email, "id_user": user.id_user})
    refresh_token_new = await create_refresh_token(data={"sub": user.email, "id_user": user.id_user})
    
    return access_token, refresh_token_new