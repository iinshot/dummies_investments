from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
from routes.auth import router as module_auth
from routes.calculator import router as calculator

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:4200",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:4200",
]

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(module_module, prefix="/api")
app.include_router(module_answer, prefix="/api")
app.include_router(module_question, prefix="/api")
app.include_router(module_quiz, prefix="/api")
app.include_router(module_article, prefix="/api")
app.include_router(module_user, prefix="/api")
app.include_router(module_auth, prefix="/api")
app.include_router(calculator, prefix="/api")  # ДОБАВЛЕН КАЛЬКУЛЯТОР

@app.get("/")
async def root():
    return {"message": "Hello"}