from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

from .User import User
from .Module import Module
from .Question import Question
from .Article import Article
from .Quiz import Quiz
from .Answer import Answer
from .QuizQuestion import QuizQuestion
from .UserModule import UserModule
from .UserArticle import UserArticle
from .UserQuiz import UserQuiz
from .UserQuizAnswer import UserQuizAnswer

__all__ = ['Base', 'User', 'Module', 'Article', 'Quiz', 'Question', 'Answer', 'QuizQuestion', 'UserModule', 'UserArticle', 'UserQuiz', 'UserQuizAnswer']