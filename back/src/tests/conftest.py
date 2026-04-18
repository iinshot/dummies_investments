import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from fastapi.testclient import TestClient
from typing import Generator

from db.session import get_db
from main import app
from models import Base, User, Module, Question, Article, Quiz, QuizQuestion, Answer
from models import UserModule, UserArticle, UserQuiz, UserQuizAnswer
from models.Question import QuestionType

TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="session")
def engine():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session(engine) -> Generator[Session, None, None]:
    connection = engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection)()
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db_session):
    user = User(name="Test User", email="test@example.com", password_hash="qwerty", salt="qwerty")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def test_module(db_session):
    module = Module(name="Test Module")
    db_session.add(module)
    db_session.commit()
    db_session.refresh(module)
    return module

@pytest.fixture
def test_quiz(db_session):
    quiz = Quiz(name="Test Quiz")
    db_session.add(quiz)
    db_session.commit()
    db_session.refresh(quiz)
    return quiz

@pytest.fixture
def test_question(db_session):
    question = Question(question_text="TestQuestion", question_type=QuestionType.RADIO)
    db_session.add(question)
    db_session.commit()
    db_session.refresh(question)
    return question