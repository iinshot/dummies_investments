import pytest
from datetime import datetime, timedelta, timezone
from models import User
from auth.security import authenticate_user, create_access_token, create_refresh_token, refresh_access_token
from auth.dependencies import get_current_user
from crud.user import create_user

@pytest.mark.asyncio
class TestAuth:
    async def test_authenticate_user(self, db_session):
        user = await create_user(db_session, "Test1", "test1@gmail.com", "test1")
        result = await authenticate_user(db_session, user.email, "test1")

        assert result
    
    async def test_access_token(self, db_session):
        user = await create_user(db_session, "Test2", "test2@gmail.com", "test2")
        token = await create_access_token({"sub":user.email, "id_user": user.id_user}, timedelta(minutes=1))
        result = await get_current_user(token)

        assert result["email"] == user.email
        assert result["id_user"] == user.id_user

    async def test_refresh_token(self, db_session):
        user = await create_user(db_session, "Test3", "test3@gmail.com", "test3")
        token = await create_refresh_token({"sub":user.email, "id_user": user.id_user})
        new_access_token, new_refresh_token = await refresh_access_token(db_session, token)
        result = await get_current_user(new_access_token)

        assert result["email"] == user.email
        assert result["id_user"] == user.id_user