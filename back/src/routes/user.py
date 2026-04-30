from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from crud import user as user_crud
from db.session import get_db
from typing import Optional

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
async def get_all_users(
        skip: int = Query(0, ge=0),
        limit: int = Query(100, ge=1, le=1000),
        db: AsyncSession = Depends(get_db)
):
    return await user_crud.get_all_users(db, skip=skip, limit=limit)

@router.get("/{id_user}")
async def get_user(id_user: int, db: AsyncSession = Depends(get_db)):
    user = await user_crud.get_user(db, id_user=id_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/")
async def create_user(
        name: str,
        email: str,
        password: str,
        surname: Optional[str] = None,
        patronymic: Optional[str] = None,
        phone: Optional[str] = None,
        about: Optional[str] = None,
        db: AsyncSession = Depends(get_db)
):
    return await user_crud.create_user(
        db,
        name=name,
        email=email,
        password=password,
        surname=surname,
        patronymic=patronymic,
        phone=phone,
        about=about
    )

@router.put("/{id_user}")
async def update_user(
        id_user: int,
        name: Optional[str] = None,
        surname: Optional[str] = None,
        patronymic: Optional[str] = None,
        phone: Optional[str] = None,
        about: Optional[str] = None,
        email: Optional[str] = None,
        db: AsyncSession = Depends(get_db)
):
    kwargs = {}
    if name is not None:
        kwargs["name"] = name
    if surname is not None:
        kwargs["surname"] = surname
    if patronymic is not None:
        kwargs["patronymic"] = patronymic
    if phone is not None:
        kwargs["phone"] = phone
    if about is not None:
        kwargs["about"] = about
    if email is not None:
        kwargs["email"] = email

    if not kwargs:
        raise HTTPException(status_code=400, detail="No fields to update")

    user = await user_crud.update_user(db, id_user=id_user, **kwargs)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{id_user}")
async def delete_user(id_user: int, db: AsyncSession = Depends(get_db)):
    deleted = await user_crud.delete_user(db, id_user=id_user)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}