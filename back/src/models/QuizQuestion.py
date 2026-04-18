from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from . import Base

class QuizQuestion(Base):
    __tablename__ = "quizes_questions"

    id_question: Mapped[int] = mapped_column(ForeignKey("questions.id_question"), primary_key=True)
    id_quiz: Mapped[int] = mapped_column(ForeignKey("quizes.id_quiz"), primary_key=True)

    question = relationship('Question', back_populates='quizes_questions')
    quiz = relationship('Quiz', back_populates='quizes_questions')