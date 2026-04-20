from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import Optional, List
import bcrypt
from ..models.User import User

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