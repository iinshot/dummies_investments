from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from crud import question as question_crud
from db.session import get_db
from typing import Optional
from models.Question import QuestionType

router = APIRouter(prefix="/questions", tags=["questions"])

@router.get("/")
async def get_questions(
    id_article: Optional[int] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    if id_article:
        questions = await question_crud.get_questions_by_article(db, id_article=id_article, skip=skip, limit=limit)
    else:
        questions = await question_crud.get_all_questions(db, skip=skip, limit=limit)
    return questions

@router.get("/{id_question}")
async def get_question(id_question: int, db: AsyncSession = Depends(get_db)):
    question = await question_crud.get_question(db, id_question=id_question)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.post("/")
async def create_question(
        question_text: str,
        question_type: QuestionType,
        db: AsyncSession = Depends(get_db)
):
    return await question_crud.create_question(
        db,
        question_text=question_text,
        question_type=question_type
    )

@router.put("/{id_question}")
async def update_question(
        id_question: int,
        question_text: str | None = None,
        question_type: QuestionType | None = None,
        db: AsyncSession = Depends(get_db)
):
    kwargs = {}
    if question_text is not None:
        kwargs["question_text"] = question_text
    if question_type is not None:
        kwargs["question_type"] = question_type

    if not kwargs:
        raise HTTPException(status_code=400, detail="No fields to update")

    question = await question_crud.update_question(db, id_question=id_question, **kwargs)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.delete("/{id_question}")
async def delete_question(id_question: int, db: AsyncSession = Depends(get_db)):
    deleted = await question_crud.delete_question(db, id_question=id_question)
    if not deleted:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"detail": "Question deleted"}