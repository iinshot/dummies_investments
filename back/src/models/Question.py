from typing import List
from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
import enum

from . import Base, QuizQuestion

class QuiestionType(enum.Enum):
    CHECKBOX = "checkbox"
    RADIO = "radio"

class Question(Base):
    __tablename__ = "questions"

    id_question: Mapped[int] = mapped_column(primary_key=True)
    question_text: Mapped[str] = mapped_column(String(1023))
    question_type: Mapped[QuiestionType] = mapped_column(Enum(QuiestionType), nullable=False)
    quizes_questions: Mapped[List["QuizQuestion"]] = relationship("QuizQuestion", back_populates='question')
    quizes = association_proxy('quizes_questions', 'question', creator=lambda question: QuizQuestion(question=question))
    answers: Mapped[List["Answer"]] = relationship(back_populates='question', cascade="all, delete-orphan")