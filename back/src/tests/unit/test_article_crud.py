import pytest
from crud import article

class TestArticleCRUD:
    @pytest.mark.asyncio
    async def test_create_article(self, db_session, test_module):
        """Тест создания статьи"""
        data = await article.create_article(
            session=db_session,
            name="Test Article",
            content={"block1": "text", "block2": "more text"},
            id_module=test_module.id_module
        )

        assert data.id_article is not None
        assert data.name == "Test Article"
        assert data.content == {"block1": "text", "block2": "more text"}
        assert data.id_module == test_module.id_module
        assert data.id_quiz is None

    @pytest.mark.asyncio
    async def test_create_article_with_quiz(self, db_session, test_module, test_quiz):
        """Тест создания статьи с привязанным тестом"""
        data = await article.create_article(
            session=db_session,
            name="Article with Quiz",
            content={"text": "content"},
            id_module=test_module.id_module,
            id_quiz=test_quiz.id_quiz
        )

        assert data.id_article is not None
        assert data.name == "Article with Quiz"
        assert data.id_module == test_module.id_module
        assert data.id_quiz == test_quiz.id_quiz

    @pytest.mark.asyncio
    async def test_get_article(self, db_session, test_article):
        """Тест получения статьи по ID"""
        data = await article.get_article(db_session, test_article.id_article)

        assert data is not None
        assert data.id_article == test_article.id_article
        assert data.name == test_article.name
        assert data.content == test_article.content

    @pytest.mark.asyncio
    async def test_get_all_articles(self, db_session, test_module):
        """Тест получения всех статей"""
        await article.create_article(
            session=db_session,
            name="First Article",
            content={"text": "first"},
            id_module=test_module.id_module
        )

        await article.create_article(
            session=db_session,
            name="Second Article",
            content={"text": "second"},
            id_module=test_module.id_module
        )

        articles = await article.get_all_articles(db_session)

        assert len(articles) >= 2
        assert any(a.name == "First Article" for a in articles)
        assert any(a.name == "Second Article" for a in articles)

    @pytest.mark.asyncio
    async def test_update_article(self, db_session, test_article):
        """Тест обновления статьи"""
        updated_article = await article.update_article(
            db_session,
            test_article.id_article,
            name="Updated Article Name",
            content={"new": "content", "updated": True}
        )

        assert updated_article is not None
        assert updated_article.name == "Updated Article Name"
        assert updated_article.content == {"new": "content", "updated": True}

    @pytest.mark.asyncio
    async def test_delete_article(self, db_session, test_article):
        """Тест удаления статьи"""
        result = await article.delete_article(db_session, test_article.id_article)
        deleted_article = await article.get_article(db_session, test_article.id_article)

        assert result is True
        assert deleted_article is None