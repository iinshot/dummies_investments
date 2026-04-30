from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from crud import article as article_crud
from db.session import get_db
from typing import Any, Dict, Optional

router = APIRouter(prefix="/articles", tags=["articles"])

@router.get("/")
async def get_all_articles(
        skip: int = Query(0, ge=0),
        limit: int = Query(100, ge=1, le=1000),
        db: AsyncSession = Depends(get_db)
):
    return await article_crud.get_all_articles(db, skip=skip, limit=limit)

@router.get("/{id_article}")
async def get_article(id_article: int, db: AsyncSession = Depends(get_db)):
    article = await article_crud.get_article(db, id_article=id_article)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@router.post("/")
async def create_article(
        name: str,
        id_module: int,
        content: Dict[str, Any],
        id_quiz: Optional[int] = None,
        db: AsyncSession = Depends(get_db)
):
    return await article_crud.create_article(
        db,
        name=name,
        content=content,
        id_module=id_module,
        id_quiz=id_quiz
    )

@router.put("/{id_article}")
async def update_article(
        id_article: int,
        name: str | None = None,
        content: Dict[str, Any] | None = None,
        id_module: int | None = None,
        id_quiz: int | None = None,
        db: AsyncSession = Depends(get_db)
):
    kwargs = {}
    if name is not None:
        kwargs["name"] = name
    if content is not None:
        kwargs["content"] = content
    if id_module is not None:
        kwargs["id_module"] = id_module
    if id_quiz is not None:
        kwargs["id_quiz"] = id_quiz

    if not kwargs:
        raise HTTPException(status_code=400, detail="No fields to update")

    article = await article_crud.update_article(db, id_article=id_article, **kwargs)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@router.delete("/{id_article}")
async def delete_article(id_article: int, db: AsyncSession = Depends(get_db)):
    deleted = await article_crud.delete_article(db, id_article=id_article)
    if not deleted:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"detail": "Article deleted"}