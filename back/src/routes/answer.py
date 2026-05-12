from typing import Optional  # ← ДОБАВЬТЕ ЭТУ СТРОКУ
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from crud import answer as answer_crud
from db.session import get_db

router = APIRouter(prefix="/answers", tags=["answers"])

@router.get("/{id_answer}")
async def get_answer(id_answer: int, db: AsyncSession = Depends(get_db)):
    answer = await answer_crud.get_answer(db, id_answer=id_answer)
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")
    return answer


@router.get("/")
async def get_answers(
    id_question: Optional[int] = None, 
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    if id_question:
        answers = await answer_crud.get_answers_by_question(db, id_question=id_question, skip=skip, limit=limit)
    else:
        answers = await answer_crud.get_all_answers(db, skip=skip, limit=limit)
    return answers

@router.post("/")
async def create_answer(
        answer_text: str,
        id_question: int,
        is_correct: bool = False,
        db: AsyncSession = Depends(get_db)
):
    answer = await answer_crud.create_answer(
        db,
        answer_text=answer_text,
        id_question=id_question,
        is_correct=is_correct
    )
    return answer

@router.put("/{id_answer}")
async def update_answer(
        id_answer: int,
        answer_text: str | None = None,
        id_question: int | None = None,
        is_correct: bool | None = None,
        db: AsyncSession = Depends(get_db)
):
    kwargs = {}
    if answer_text is not None:
        kwargs["answer_text"] = answer_text
    if id_question is not None:
        kwargs["id_question"] = id_question
    if is_correct is not None:
        kwargs["is_correct"] = is_correct

    if not kwargs:
        raise HTTPException(status_code=400, detail="No fields to update")

    answer = await answer_crud.update_answer(db, id_answer=id_answer, **kwargs)
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")
    return answer

@router.delete("/{id_answer}")
async def delete_answer(id_answer: int, db: AsyncSession = Depends(get_db)):
    deleted = await answer_crud.delete_answer(db, id_answer=id_answer)
    if not deleted:
        raise HTTPException(status_code=404, detail="Answer not found")
    return {"detail": "Answer deleted"}