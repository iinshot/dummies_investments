from fastapi import FastAPI
import uvicorn
from db.session import engine, get_db
from sqlalchemy import select
from contextlib import asynccontextmanager
from models import Base
from routes.module import router as module_module
from routes.answer import router as module_answer
from routes.question import router as module_question
from routes.quiz import router as module_quiz
from routes.article import router as module_article
from routes.user import router as module_user

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(root_path="/api", lifespan=lifespan)

app.include_router(module_module)
app.include_router(module_answer)
app.include_router(module_question)
app.include_router(module_quiz)
app.include_router(module_article)
app.include_router(module_user)

@app.get("/")
async def root():
    return {"message": "Hello"}