from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, and_, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from crud import quiz as quiz_crud
from crud import answer as answer_crud
from db.session import get_db
from models.Question import Question, QuestionType
from models.Answer import Answer
from models.User import User
from models.UserQuiz import UserQuiz
from models.UserQuizAnswer import UserQuizAnswer
from models.QuizQuestion import QuizQuestion
from auth.dependencies import get_current_user

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

@router.get("/")
async def get_all_quizzes(
        skip: int = Query(0, ge=0),
        limit: int = Query(100, ge=1, le=1000),
        db: AsyncSession = Depends(get_db)
):
    return await quiz_crud.get_all_quizzes(db, skip=skip, limit=limit)

@router.get("/{id_quiz}")
async def get_quiz(id_quiz: int, db: AsyncSession = Depends(get_db)):
    quiz = await quiz_crud.get_quiz(db, id_quiz=id_quiz)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@router.post("/")
async def create_quiz(
        name: str,
        db: AsyncSession = Depends(get_db)
):
    return await quiz_crud.create_quiz(db, name=name)

@router.put("/{id_quiz}")
async def update_quiz(
        id_quiz: int,
        name: str | None = None,
        db: AsyncSession = Depends(get_db)
):
    if name is None:
        raise HTTPException(status_code=400, detail="No fields to update")

    quiz = await quiz_crud.update_quiz(db, id_quiz=id_quiz, name=name)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@router.delete("/{id_quiz}")
async def delete_quiz(id_quiz: int, db: AsyncSession = Depends(get_db)):
    deleted = await quiz_crud.delete_quiz(db, id_quiz=id_quiz)
    if not deleted:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return {"detail": "Quiz deleted"}

@router.post("/start_quiz/{id_quiz}")
async def start_quiz(id_quiz: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    quiz = await quiz_crud.get_quiz(db, id_quiz)
    if(not quiz):
        raise HTTPException(status_code=404, detail=f"Quiz {id_quiz} not found")
    user_quiz = await db.get(UserQuiz, (user.id_user, id_quiz))
    if(user_quiz):
        user_quiz.is_completed = False
    else:
        user_quiz = UserQuiz(id_user = user.id_user, id_quiz = id_quiz)
        db.add(user_quiz)
    stmt_qq = delete(UserQuizAnswer).where(UserQuizAnswer.id_user == user.id_user, UserQuizAnswer.id_quiz == id_quiz)
    result_qq = await db.execute(stmt_qq)
    await db.commit()
    return {"user_quiz": user_quiz, "quiz": quiz}


@router.post("/answer_question/{id_quiz}/{id_answer}")
async def answer_question(
        id_quiz: int,
        id_answer: int,
        user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    quiz = await quiz_crud.get_quiz(db, id_quiz)
    if(not quiz):
        raise HTTPException(status_code=404, detail=f"Quiz {id_quiz} not found")
    answer = await answer_crud.get_answer(db, id_answer)
    if(not answer):
        raise HTTPException(status_code=404, detail=f"Answer {id_answer} not found")
    user_quiz = await db.get(UserQuiz, (user.id_user, id_quiz))
    if(not user_quiz):
        raise HTTPException(status_code=400, detail=f"Quiz {id_quiz} has not been started")
    if(user_quiz.is_completed):
        raise HTTPException(status_code=400, detail=f"Quiz {id_quiz} has already been completed")
    user_quiz_answer = await db.get(UserQuizAnswer, (user.id_user, id_quiz, id_answer))
    if(user_quiz_answer):
        raise HTTPException(status_code=400, detail=f"Answer {id_answer} for quiz {id_quiz} has already been given")
    question = await db.get(Question, (answer.id_question))
    quiz_question = await db.get(QuizQuestion, (question.id_question, id_quiz))
    if(not quiz_question):
        raise HTTPException(status_code=400, detail=f"Question {question.id_question} is not in quiz {id_quiz}")
    if(question.question_type == QuestionType.RADIO):
        stmt = select(UserQuizAnswer).join(
            Answer, UserQuizAnswer.id_answer == Answer.id_answer
        ).where(
            and_(
                UserQuizAnswer.id_user == user.id_user,
                UserQuizAnswer.id_quiz == id_quiz,
                Answer.id_question == question.id_question
            )
        )
        result = await db.execute(stmt)
        user_quiz_answers = result.scalars().all()
        if(len(user_quiz_answers)>0):
            raise HTTPException(status_code=403, detail=f"Answer for question {question.id_question} in quiz {id_quiz} has already been given")
    user_quiz_answer = UserQuizAnswer(id_user = user.id_user, id_quiz = id_quiz, id_answer = id_answer)
    db.add(user_quiz_answer)
    await db.commit()
    return {}
@router.get("/{id_quiz}/questions")
async def get_quiz_questions(
    id_quiz: int,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(QuizQuestion).where(QuizQuestion.id_quiz == id_quiz).options(
        selectinload(QuizQuestion.question)
    )
    result = await db.execute(stmt)
    quiz_questions = result.scalars().all()
    return [qq.question for qq in quiz_questions]
@router.get("/get_next_question/{id_quiz}")
async def get_next_question(
        id_quiz: int,
        user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)      
):
    quiz = await quiz_crud.get_quiz(db, id_quiz)
    if(not quiz):
        raise HTTPException(status_code=404, detail=f"Quiz {id_quiz} not found")
    user_quiz = await db.get(UserQuiz, (user.id_user, id_quiz))
    if(not user_quiz):
        raise HTTPException(status_code=400, detail=f"Quiz {id_quiz} has not been started")
    if(user_quiz.is_completed):
        raise HTTPException(status_code=400, detail=f"Quiz {id_quiz} has already been completed")
    stmt_qq = select(QuizQuestion).where(QuizQuestion.id_quiz == id_quiz).options(
        selectinload(QuizQuestion.question)
        .selectinload(Question.answers)
    )
    result_qq = await db.execute(stmt_qq)
    quiz_questions = result_qq.scalars().all()
    for quiz_question in quiz_questions:
        question = quiz_question.question
        stmt = select(UserQuizAnswer).join(
            Answer, UserQuizAnswer.id_answer == Answer.id_answer
        ).where(
            and_(
                UserQuizAnswer.id_user == user.id_user,
                UserQuizAnswer.id_quiz == id_quiz,
                Answer.id_question == question.id_question
            )
        )
        result = await db.execute(stmt)
        user_quiz_answers = result.scalars().all()
        if(len(user_quiz_answers)==0):
            return {question}
    return await end_quiz(id_quiz, user, db)

@router.post("/end_quiz/{id_quiz}")
async def end_quiz(
        id_quiz: int,
        user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)      
):
    quiz = await quiz_crud.get_quiz(db, id_quiz)
    if(not quiz):
        raise HTTPException(status_code=404, detail=f"Quiz {id_quiz} not found")
    user_quiz = await db.get(UserQuiz, (user.id_user, id_quiz))
    if(not user_quiz):
        raise HTTPException(status_code=400, detail=f"Quiz {id_quiz} has not been started")
    if(user_quiz.is_completed):
        raise HTTPException(status_code=400, detail=f"Quiz {id_quiz} has already been completed")
    results = {"right": [], "wrong": []}
    stmt_qq = select(QuizQuestion).where(QuizQuestion.id_quiz == id_quiz).options(
        selectinload(QuizQuestion.question)
        .selectinload(Question.answers)
    )
    result_qq = await db.execute(stmt_qq)
    quiz_questions = result_qq.scalars().all()
    for quiz_question in quiz_questions:
        question = quiz_question.question
        if(question.question_type == QuestionType.RADIO):
            for answer in question.answers:
                user_quiz_answer = await db.get(UserQuizAnswer, (user.id_user, id_quiz, answer.id_answer))
                if(not user_quiz_answer):
                    continue
                if(answer.is_correct):
                    results["right"].append({"question": question, "given_answers": [answer]})
                else:
                    stmt = select(Answer).where(Answer.id_question == question.id_question, Answer.is_correct)
                    result = await db.execute(stmt)
                    correct_answers = result.scalars().all()
                    results["wrong"].append({"question": question, "given_answers": [answer], "correct_answers": correct_answers})
                break
        if(question.question_type == QuestionType.CHECKBOX):
            given_answers = []
            all_answers_correct = True
            for answer in question.answers:
                user_quiz_answer = await db.get(UserQuizAnswer, (user.id_user, id_quiz, answer.id_answer))
                if(not user_quiz_answer):
                    if(answer.is_correct):
                        all_answers_correct = False
                else:
                    given_answers.append(answer)
                    if(not answer.is_correct):
                        all_answers_correct = False
            if(all_answers_correct):
                results["right"].append({"question": question, "given_answers": given_answers})
            else:
                stmt = select(Answer).where(Answer.id_question == question.id_question, Answer.is_correct)
                result = await db.execute(stmt)
                correct_answers = result.scalars().all()
                results["wrong"].append({"question": question, "given_answers": given_answers, "correct_answers": correct_answers})
    user_quiz.is_completed = True
    user.points += len(results["right"]) * 10;
    await db.commit()
    return results