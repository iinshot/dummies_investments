from typing import Optional, List
from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from . import Base
from .UserModule import UserModule
from .UserArticle import UserArticle
from .UserQuiz import UserQuiz
from .UserQuizAnswer import UserQuizAnswer

class User(Base):
    __tablename__ = "users"

    id_user: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    surname: Mapped[Optional[str]]
    patronymic: Mapped[Optional[str]]
    phone: Mapped[Optional[str]] = mapped_column(String(10), unique=True)
    about: Mapped[Optional[str]]
    points: Mapped[int] = mapped_column(default=0)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    salt: Mapped[str] = mapped_column(String(127))

    users_modules: Mapped[List["UserModule"]] = relationship("UserModule", back_populates='user')
    modules = association_proxy('users_modules', 'module', creator=lambda module: UserModule(module=module))
    users_articles: Mapped[List["UserArticle"]] = relationship("UserArticle", back_populates='user')
    articles = association_proxy('users_articles', 'article', creator=lambda article: UserArticle(article=article))
    users_quizes: Mapped[List["UserQuiz"]] = relationship("UserQuiz", back_populates='user')
    quizes = association_proxy('users_quizes', 'quiz', creator=lambda quiz: UserQuiz(quiz=quiz))
    users_quizes_answers: Mapped[List["UserQuizAnswer"]] = relationship("UserQuizAnswer", back_populates='user')