from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from crud import user as user_crud
from db.session import get_db
from typing import Optional
from auth.dependencies import get_current_user
from models.User import User
from models.UserArticle import UserArticle

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
async def get_all_users(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=1000), db: AsyncSession = Depends(get_db)):
    return await user_crud.get_all_users(db, skip=skip, limit=limit)

@router.get("/me")
async def get_me(user: User = Depends(get_current_user)):
    return {
        "id_user": user.id_user, "name": user.name, "email": user.email,
        "points": user.points, "quiz_rating": user.quiz_rating,
        "surname": user.surname, "patronymic": user.patronymic,
        "phone": user.phone, "about": user.about
    }
@router.get("/users_count")
async def get_users_count_route(db: AsyncSession = Depends(get_db)):
    count = await user_crud.get_users_count(db)
    return {"count": count}
@router.get("/get_total_progress/")
async def get_total_progress(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(UserArticle).where(UserArticle.id_user == user.id_user)
    result = await db.execute(stmt)
    user_articles = result.scalars().all()
    return {"articles": [user_articles]}

@router.post("/set_progress/{id_article}")
async def set_progress(id_article: int, last_checkpoint: int | None = None, is_read: bool | None = None,
    user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    article = await user_crud.get_article(db, id_article=id_article)
    if not article:
        raise HTTPException(status_code=404, detail=f"Article {id_article} not found")
    user_article = await db.get(UserArticle, (user.id_user, id_article))
    if not user_article:
        user_article = UserArticle(id_user=user.id_user, id_article=id_article)
        db.add(user_article)
    if last_checkpoint: user_article.last_checkpoint = last_checkpoint
    if is_read: user_article.is_read = is_read
    await db.commit()
    return {}

@router.get("/get_progress/{id_article}")
async def get_progress(id_article: Optional[int], user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user_article = await db.get(UserArticle, (user.id_user, id_article))
    if not user_article:
        return {"id_article": id_article, "is_read": False, "last_checkpoint": 0}
    return {"id_article": id_article, "is_read": user_article.is_read, "last_checkpoint": user_article.last_checkpoint}

@router.get("/{id_user}")
async def get_user(id_user: int, db: AsyncSession = Depends(get_db)):
    user = await user_crud.get_user(db, id_user=id_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/")
async def create_user(name: str, email: str, password: str, points: Optional[int] = None,
    surname: Optional[str] = None, patronymic: Optional[str] = None,
    phone: Optional[str] = None, about: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    return await user_crud.create_user(db, name=name, email=email, password=password,
        points=points, surname=surname, patronymic=patronymic, phone=phone, about=about)

@router.put("/{id_user}")
async def update_user(id_user: int, name: Optional[str] = None, surname: Optional[str] = None,
    patronymic: Optional[str] = None, phone: Optional[str] = None, about: Optional[str] = None,
    email: Optional[str] = None, points: Optional[int] = None, quiz_rating: Optional[dict] = None,
    total_points: Optional[int] = None,  # ← ДОБАВИТЬ
    db: AsyncSession = Depends(get_db)):
    kwargs = {}
    if name is not None: kwargs["name"] = name
    if surname is not None: kwargs["surname"] = surname
    if patronymic is not None: kwargs["patronymic"] = patronymic
    if phone is not None: kwargs["phone"] = phone
    if about is not None: kwargs["about"] = about
    if email is not None: kwargs["email"] = email
    if points is not None: kwargs["points"] = points
    if total_points is not None: kwargs["total_points"] = total_points  # ← ДОБАВИТЬ
    if quiz_rating is not None: kwargs["quiz_rating"] = quiz_rating
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

@router.get("/{id_user}/rating")
async def get_rating(id_user: int, db: AsyncSession = Depends(get_db)):
    user = await user_crud.get_user(db, id_user=id_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    top8 = await user_crud.get_users_above(db, points=0)
    top8 = top8[:8]
    if any(u.id_user == id_user for u in top8):
        return top8
    return await user_crud.get_users_above(db, points=user.total_points)

@router.get("/{id_user}/statistics")
async def get_user_progress(id_user: int, db: AsyncSession = Depends(get_db)):
    user = await user_crud.get_user(db, id_user=id_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return await user_crud.get_user_progress(db, id_user=id_user)

@router.get("/{id_user}/activity")
async def get_user_activity(id_user: int, db: AsyncSession = Depends(get_db)):
    user = await user_crud.get_user(db, id_user=id_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return await user_crud.get_user_activity(db, id_user=id_user)


