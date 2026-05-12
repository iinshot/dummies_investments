from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import Optional, List
import bcrypt
from models.User import User
from models.Article import Article  # ← ДОБАВЬТЕ ЭТОТ ИМПОРТ


async def create_user(
    session: AsyncSession,
    name: str,
    email: str,
    password: str,
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
    # Сначала обновляем
    query = update(User).where(User.id_user == id_user).values(**kwargs)
    await session.execute(query)
    await session.commit()
    
    # Потом получаем обновленного пользователя
    result = await session.execute(select(User).where(User.id_user == id_user))
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


# ========= ДОБАВЬТЕ ЭТИ ФУНКЦИИ =========

async def get_article(
    session: AsyncSession,
    id_article: int
) -> Optional[Article]:
    """Получение статьи по ID"""
    query = select(Article).where(Article.id_article == id_article)
    result = await session.execute(query)
    return result.scalar_one_or_none()


async def get_article_by_number(
    session: AsyncSession,
    number: int
) -> Optional[Article]:
    """Получение статьи по номеру"""
    query = select(Article).where(Article.number == number)
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