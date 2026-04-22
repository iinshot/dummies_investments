import pytest
from crud import module

class TestModuleCRUD:
    @pytest.mark.asyncio
    async def test_create_module(self, db_session):
        """Тест создания модуля"""
        data = await module.create_module(
            session=db_session,
            name="Test Module"
        )

        assert data.id_module is not None
        assert data.name == "Test Module"
        assert data.id_quiz is None

    @pytest.mark.asyncio
    async def test_create_module_with_quiz(self, db_session, test_quiz):
        """Тест создания модуля с привязанным тестом"""
        data = await module.create_module(
            session=db_session,
            name="Module with Quiz",
            id_quiz=test_quiz.id_quiz
        )

        assert data.id_module is not None
        assert data.name == "Module with Quiz"
        assert data.id_quiz == test_quiz.id_quiz

    @pytest.mark.asyncio
    async def test_get_module(self, db_session, test_module):
        """Тест получения модуля по ID"""
        data = await module.get_module(db_session, test_module.id_module)

        assert data is not None
        assert data.id_module == test_module.id_module
        assert data.name == test_module.name

    @pytest.mark.asyncio
    async def test_get_all_modules(self, db_session):
        """Тест получения всех модулей"""
        await module.create_module(
            session=db_session,
            name="First Module"
        )

        await module.create_module(
            session=db_session,
            name="Second Module"
        )

        modules = await module.get_all_modules(db_session)

        assert len(modules) >= 2
        assert any(m.name == "First Module" for m in modules)
        assert any(m.name == "Second Module" for m in modules)

    @pytest.mark.asyncio
    async def test_update_module(self, db_session, test_module):
        """Тест обновления модуля"""
        updated_module = await module.update_module(
            db_session,
            test_module.id_module,
            name="Updated Module Name"
        )

        assert updated_module is not None
        assert updated_module.name == "Updated Module Name"

    @pytest.mark.asyncio
    async def test_delete_module(self, db_session, test_module):
        """Тест удаления модуля"""
        result = await module.delete_module(db_session, test_module.id_module)
        deleted_module = await module.get_module(db_session, test_module.id_module)

        assert result is True
        assert deleted_module is None