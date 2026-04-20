from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import Optional, List
from models.Question import Question, QuestionType

async def create_question(
    session: AsyncSession,
    question_text: str,
    question_type: QuestionType
) -> Question:
    """Создание вопроса"""
    question = Question(
        question_text=question_text,
        question_type=question_type
    )
    session.add(question)
    await session.commit()
    await session.refresh(question)
    return question

async def get_question(
    session: AsyncSession,
    id_question: int
) -> Optional[Question]:
    """Получение вопроса по ID"""
    query = select(Question).where(Question.id_question == id_question)
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_all_questions(
    session: AsyncSession,
    skip: int = 0,
    limit: int = 100
) -> List[Question]:
    """Получение всех вопросов"""
    query = select(Question).offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()

async def update_question(
    session: AsyncSession,
    id_question: int,
    **kwargs
) -> Optional[Question]:
    """Обновление вопроса"""
    query = update(Question).where(Question.id_question == id_question).values(**kwargs).returning(Question)
    result = await session.execute(query)
    await session.commit()
    return result.scalar_one_or_none()

async def delete_question(
    session: AsyncSession,
    id_question: int
) -> bool:
    """Удаление вопроса"""
    query = delete(Question).where(Question.id_question == id_question)
    result = await session.execute(query)
    await session.commit()
    return result.rowcount > 0