from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import Optional, List, Any, Dict
from models.Article import Article

async def create_article(
    session: AsyncSession,
    name: str,
    content: Dict[str, Any],
    id_module: int,
    id_quiz: Optional[int] = None
) -> Article:
    """Создание статьи"""
    article = Article(
        name=name,
        content=content,
        id_module=id_module,
        id_quiz=id_quiz
    )
    session.add(article)
    await session.commit()
    await session.refresh(article)
    return article

async def get_article(
    session: AsyncSession,
    id_article: int
) -> Optional[Article]:
    """Получение статьи по ID"""
    query = select(Article).where(Article.id_article == id_article)
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_all_articles(
    session: AsyncSession,
    skip: int = 0,
    limit: int = 100
) -> List[Article]:
    """Получение всех статей"""
    query = select(Article).offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()

async def update_article(
    session: AsyncSession,
    id_article: int,
    **kwargs
) -> Optional[Article]:
    """Обновление статьи"""
    query = update(Article).where(Article.id_article == id_article).values(**kwargs).returning(Article)
    result = await session.execute(query)
    await session.commit()
    return result.scalar_one_or_none()

async def delete_article(
    session: AsyncSession,
    id_article: int
) -> bool:
    """Удаление статьи"""
    query = delete(Article).where(Article.id_article == id_article)
    result = await session.execute(query)
    await session.commit()
    return result.rowcount > 0