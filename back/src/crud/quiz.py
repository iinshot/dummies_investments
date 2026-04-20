from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import Optional, List
from ..models.Quiz import Quiz

async def create_quiz(
    session: AsyncSession,
    name: str
) -> Quiz:
    """Создание теста"""
    quiz = Quiz(name=name)
    session.add(quiz)
    await session.commit()
    await session.refresh(quiz)
    return quiz

async def get_quiz(
    session: AsyncSession,
    id_quiz: int
) -> Optional[Quiz]:
    """Получение теста по ID"""
    query = select(Quiz).where(Quiz.id_quiz == id_quiz)
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_all_quizes(
    session: AsyncSession,
    skip: int = 0,
    limit: int = 100
) -> List[Quiz]:
    """Получение всех тестов"""
    query = select(Quiz).offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()

async def update_quiz(
    session: AsyncSession,
    id_quiz: int,
    **kwargs
) -> Optional[Quiz]:
    """Обновление теста"""
    query = update(Quiz).where(Quiz.id_quiz == id_quiz).values(**kwargs).returning(Quiz)
    result = await session.execute(query)
    await session.commit()
    return result.scalar_one_or_none()

async def delete_quiz(
    session: AsyncSession,
    id_quiz: int
) -> bool:
    """Удаление теста"""
    query = delete(Quiz).where(Quiz.id_quiz == id_quiz)
    result = await session.execute(query)
    await session.commit()
    return result.rowcount > 0