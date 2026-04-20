from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import Optional, List
from models.Module import Module

async def create_module(
    session: AsyncSession,
    name: str,
    id_quiz: Optional[int] = None
) -> Module:
    """Создание модуля"""
    module = Module(name=name, id_quiz=id_quiz)
    session.add(module)
    await session.commit()
    await session.refresh(module)
    return module

async def get_module(
    session: AsyncSession,
    id_module: int
) -> Optional[Module]:
    """Получение модуля по ID"""
    query = select(Module).where(Module.id_module == id_module)
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_all_modules(
    session: AsyncSession,
    skip: int = 0,
    limit: int = 100
) -> List[Module]:
    """Получение всех модулей"""
    query = select(Module).offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()

async def update_module(
    session: AsyncSession,
    id_module: int,
    **kwargs
) -> Optional[Module]:
    """Обновление модуля"""
    query = update(Module).where(Module.id_module == id_module).values(**kwargs).returning(Module)
    result = await session.execute(query)
    await session.commit()
    return result.scalar_one_or_none()

async def delete_module(
    session: AsyncSession,
    id_module: int
) -> bool:
    """Удаление модуля"""
    query = delete(Module).where(Module.id_module == id_module)
    result = await session.execute(query)
    await session.commit()
    return result.rowcount > 0