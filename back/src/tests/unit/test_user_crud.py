import pytest
from crud import user

class TestUserCRUD:
    @pytest.mark.asyncio
    async def test_create_user(self, db_session):
        data = await user.create_user(
            session=db_session,
            name="John Doe",
            email="john@example.com",
            password="secret123",
            phone="1234567890",
            surname="Doe",
            about="Test user"
        )

        assert data.id_user is not None
        assert data.name == "John Doe"
        assert data.email == "john@example.com"
        assert data.phone == "1234567890"
        assert data.password_hash != "secret123"
        assert data.salt is not None

    @pytest.mark.asyncio
    async def test_get_user(self, db_session, test_user):
        data = await user.get_user(db_session, test_user.id_user)

        assert data is not None
        assert data.id_user == test_user.id_user
        assert data.email == test_user.email

    @pytest.mark.asyncio
    async def test_get_all_users(self, db_session):
        await user.create_user(
            session=db_session,
            name="John Doe",
            email="john@example.com",
            password="secret123"
        )

        await user.create_user(
            session=db_session,
            name="Jane Doe",
            email="jane@example.com",
            password="secret456"
        )

        users = await user.get_all_users(db_session)

        assert len(users) >= 2
        assert any(u.email == "john@example.com" for u in users)
        assert any(u.email == "jane@example.com" for u in users)

    @pytest.mark.asyncio
    async def test_update_user(self, db_session, test_user):
        updated_user = await user.update_user(
            db_session,
            test_user.id_user,
            name="Updated Name",
            about="Updated about"
        )

        assert updated_user is not None
        assert updated_user.name == "Updated Name"
        assert updated_user.about == "Updated about"

    @pytest.mark.asyncio
    async def test_delete_user(self, db_session, test_user):
        result = await user.delete_user(db_session, test_user.id_user)
        deleted_user = await user.get_user(db_session, test_user.id_user)

        assert result is True
        assert deleted_user is None