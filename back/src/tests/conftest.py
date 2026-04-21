import pytest
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
from fastapi.testclient import TestClient
from typing import Generator
from httpx import AsyncClient, ASGITransport

from db.session import get_db
from main import app
from models import Base, User, Module, Question, Article, Quiz, QuizQuestion, Answer
from models import UserModule, UserArticle, UserQuiz, UserQuizAnswer
from models.Question import QuestionType

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture(scope="session")
async def engine():
    engine = create_async_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest.fixture(scope="function")
async def db_session(engine) -> Generator[AsyncSession, None, None]:
    async with engine.connect() as connection:
        async with connection.begin() as transaction:
            session = async_sessionmaker(bind=connection, expire_on_commit=False)()
            
            yield session

            await transaction.rollback()
            await session.close()

@pytest.fixture(scope="function")
async def client(db_session):
    async def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as test_client:
        yield test_client
    
    app.dependency_overrides.clear()

@pytest.fixture
async def test_user(db_session):
    user = User(name="Test User", email="test@example.com", password_hash="qwerty", salt="qwerty")
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user

@pytest.fixture
async def test_module(db_session):
    module = Module(name="Test Module")
    db_session.add(module)
    await db_session.commit()
    await db_session.refresh(module)
    return module

@pytest.fixture
async def test_quiz(db_session):
    quiz = Quiz(name="Test Quiz")
    db_session.add(quiz)
    await db_session.commit()
    await db_session.refresh(quiz)
    return quiz

@pytest.fixture
async def test_question(db_session):
    question = Question(question_text="TestQuestion", question_type=QuestionType.RADIO)
    db_session.add(question)
    await db_session.commit()
    await db_session.refresh(question)
    return question