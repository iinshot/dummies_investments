from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func
from sqlalchemy.orm import selectinload
from typing import Optional, List
import bcrypt
from models.User import User
from models.Article import Article
from models.Quiz import Quiz
from models.UserArticle import UserArticle
from models.UserQuiz import UserQuiz

async def create_user(
    session: AsyncSession,
    name: str,
    email: str,
    password: str,
    points: Optional[int] = None,
    phone: Optional[str] = None,
    surname: Optional[str] = None,
    patronymic: Optional[str] = None,
    about: Optional[str] = None
) -> User:
    """Создание пользователя"""
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password.encode(), salt)
    user = User(
        name=name,
        surname=surname,
        patronymic=patronymic,
        points=points,
        phone=phone,
        email=email,
        about=about,
        password_hash=password_hash.decode(),
        salt=salt.decode()
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

async def get_user(
    session: AsyncSession,
    id_user: int
) -> Optional[User]:
    """Получение пользователя по ID"""
    query = select(User).where(User.id_user == id_user)
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_user_by_email(
    session: AsyncSession,
    email: str
) -> Optional[User]:
    """Получение пользователя по email"""
    query = select(User).where(User.email == email)
    result = await session.execute(query)
    return result.scalar_one_or_none()


async def get_all_users(
    session: AsyncSession,
    skip: int = 0,
    limit: int = 100
) -> List[User]:
    """Получение всех пользователей"""
    query = select(User).offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()

async def update_user(
    session: AsyncSession,
    id_user: int,
    **kwargs
) -> Optional[User]:
    """Обновление пользователя"""
    query = update(User).where(User.id_user == id_user).values(**kwargs).returning(User)
    result = await session.execute(query)
    await session.commit()
    return result.scalar_one_or_none()

async def delete_user(
    session: AsyncSession,
    id_user: int
) -> bool:
    """Удаление пользователя"""
    query = delete(User).where(User.id_user == id_user)
    result = await session.execute(query)
    await session.commit()
    return result.rowcount > 0

async def get_users_above(
    session: AsyncSession,
    points: int
) -> List[User]:
    """Получение пользователей с поинтами >= текущего, по убыванию"""
    query = (
        select(User)
        .where(User.points >= points)
        .order_by(User.points.desc())
    )
    result = await session.execute(query)
    return result.scalars().all()

async def get_user_progress(session: AsyncSession, id_user: int) -> dict:
    all_articles = await session.execute(select(func.count()).select_from(Article))
    all_quizzes = await session.execute(select(func.count()).select_from(Quiz))

    user_articles = await session.execute(
        select(func.count())
        .select_from(UserArticle)
        .where(UserArticle.id_user == id_user, UserArticle.is_read == True)
    )
    user_quizzes = await session.execute(
        select(func.count())
        .select_from(UserQuiz)
        .where(UserQuiz.id_user == id_user, UserQuiz.is_completed == True)
    )

    return {
        "articles": {
            "user_progress": user_articles.scalar(),
            "all_count": all_articles.scalar()
        },
        "quizzes": {
            "user_progress": user_quizzes.scalar(),
            "all_count": all_quizzes.scalar()
        }
    }

async def get_user_activity(session: AsyncSession, id_user: int) -> list:
    articles_query = (
        select(UserArticle)
        .where(UserArticle.id_user == id_user)
        .options(selectinload(UserArticle.article))
    )
    quizzes_query = (
        select(UserQuiz)
        .where(UserQuiz.id_user == id_user)
        .options(selectinload(UserQuiz.quiz))
    )

    articles_result = await session.execute(articles_query)
    quizzes_result = await session.execute(quizzes_query)
    user_articles = articles_result.scalars().all()
    user_quizzes = quizzes_result.scalars().all()

    activity = []

    for ua in user_articles:
        activity.append({
            "type": "article",
            "name": ua.article.name,
            "created_at": ua.created_at
        })

    for uq in user_quizzes:
        activity.append({
            "type": "quiz",
            "name": uq.quiz.name,
            "created_at": uq.created_at
        })

    activity.sort(key=lambda x: x["created_at"])

    return activity