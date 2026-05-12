from typing import List, Optional
from sqlalchemy import String, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.associationproxy import association_proxy
import enum

from . import Base
from .QuizQuestion import QuizQuestion

class QuestionType(enum.Enum):
    CHECKBOX = "checkbox"
    RADIO = "radio"

class Question(Base):
    __tablename__ = "questions"

    id_question: Mapped[int] = mapped_column(primary_key=True)
    question_text: Mapped[str] = mapped_column(String(1023))
    question_type: Mapped[QuestionType] = mapped_column(Enum(QuestionType), nullable=False)
    
    # ДОБАВЬТЕ ЭТУ СТРОКУ
    id_article: Mapped[Optional[int]] = mapped_column(ForeignKey("articles.id_article"), nullable=True)
    
    quizes_questions: Mapped[List["QuizQuestion"]] = relationship("QuizQuestion", back_populates='question', lazy='selectin')
    quizes = association_proxy('quizes_questions', 'quiz', creator=lambda quiz: QuizQuestion(quiz=quiz))
    answers: Mapped[List["Answer"]] = relationship(back_populates='question', cascade="all, delete-orphan")