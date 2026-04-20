import pytest
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from models import Base, User, Module, Question, Article, Quiz, QuizQuestion, Answer
from models import UserModule, UserArticle, UserQuiz, UserQuizAnswer
from models.Question import QuestionType

@pytest.mark.asyncio
class TestUserModel:
    async def test_create_user(self, db_session):
        user = User(name="John Doe", email="john@example.com", password_hash="qwerty", salt="qwerty")
        db_session.add(user)
        await db_session.commit()
        
        assert user.id_user is not None
        assert user.name == "John Doe"
        assert user.email == "john@example.com"

@pytest.mark.asyncio
class TestModuleModel:
    async def test_create_module(self, db_session):
        module = Module(name="MyModule")
        db_session.add(module)
        await db_session.commit()
        
        assert module.id_module is not None
        assert module.name == "MyModule"

@pytest.mark.asyncio
class TestArticleModel:
    async def test_create_article(self, db_session, test_module):
        article = Article(name="MyArticle", content="{\"block1\":\"text\"}", module=test_module)
        db_session.add(article)
        await db_session.commit()

        assert article.id_article is not None
        assert article.name == "MyArticle"
        assert article.module == test_module

@pytest.mark.asyncio
class TestQuizModel:
    async def test_create_quiz(self, db_session):
        quiz = Quiz(name="MyQuiz")
        db_session.add(quiz)
        await db_session.commit()

        assert quiz.id_quiz is not None
        assert quiz.name == "MyQuiz"

    async def test_question_to_quiz(self, db_session, test_quiz, test_question):
        test_quiz.questions.append(test_question)
        await db_session.commit()
        
        assert test_quiz.questions[0] == test_question

@pytest.mark.asyncio
class TestQuestionModel:
    async def test_create_question(self, db_session, test_quiz):
        question = Question(question_text="MyQuestion", question_type=QuestionType.RADIO)
        db_session.add(question)
        await db_session.commit()

        assert question.id_question is not None
        assert question.question_text == "MyQuestion"
        assert question.question_type == QuestionType.RADIO

    async def test_quiz_to_question(self, db_session, test_question, test_quiz):
        test_question.quizes.append(test_quiz)
        await db_session.commit()

        assert test_question.quizes[0] == test_quiz

@pytest.mark.asyncio
class TestAnswerModel:
    async def test_create_answer(self, db_session, test_question):
        answer = Answer(question=test_question, answer_text="MyAnswerText", is_correct=True)
        db_session.add(answer)
        await db_session.commit()

        assert answer.id_answer is not None
        assert answer.question == test_question
        assert answer.answer_text == "MyAnswerText"
        assert answer.is_correct == True