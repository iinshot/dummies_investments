from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import Optional, List
from ..models.Answer import Answer

async def create_answer(
    session: AsyncSession,
    id_question: int,
    answer_text: str,
    is_correct: bool
) -> Answer:
    """Создание ответа"""
    answer = Answer(
        id_question=id_question,
        answer_text=answer_text,
        is_correct=is_correct
    )
    session.add(answer)
    await session.commit()
    await session.refresh(answer)
    return answer

async def get_answer(
    session: AsyncSession,
    id_answer: int
) -> Optional[Answer]:
    """Получение ответа по ID"""
    query = select(Answer).where(Answer.id_answer == id_answer)
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_all_answers(
    session: AsyncSession,
    skip: int = 0,
    limit: int = 100
) -> List[Answer]:
    """Получение всех ответов"""
    query = select(Answer).offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()

async def update_answer(
    session: AsyncSession,
    id_answer: int,
    **kwargs
) -> Optional[Answer]:
    """Обновление ответа"""
    query = update(Answer).where(Answer.id_answer == id_answer).values(**kwargs).returning(Answer)
    result = await session.execute(query)
    await session.commit()
    return result.scalar_one_or_none()

async def delete_answer(
    session: AsyncSession,
    id_answer: int
) -> bool:
    """Удаление ответа"""
    query = delete(Answer).where(Answer.id_answer == id_answer)
    result = await session.execute(query)
    await session.commit()
    return result.rowcount > 0