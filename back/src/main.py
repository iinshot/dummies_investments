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
    "http://localhost:3000",   # React, Next.js
    "http://localhost:5173",   # Vite
    "http://localhost:8080",   # Vue CLI
    "http://localhost:4200",   # Angular
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:4200",
]

app = FastAPI(root_path="/api", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allows specific origins (or ["*"] for all)
    allow_credentials=True,         # Allows cookies to be included in requests
    allow_methods=["*"],            # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],            # Allows all headers
)

app.include_router(module_module)
app.include_router(module_answer)
app.include_router(module_question)
app.include_router(module_quiz)
app.include_router(module_article)
app.include_router(module_user)
app.include_router(module_auth)
app.include_router(calculator)

@app.get("/")
async def root():
    return {"message": "Hello"}