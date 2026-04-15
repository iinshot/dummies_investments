from typing import List
from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from . import Base, QuizQuestion, UserQuiz, UserQuizAnswer

class Quiz(Base):
    __tablename__ = "quizes"

    id_quiz: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(63))
    article: Mapped["Article"] = relationship(
        back_populates="quiz"
    )
    module: Mapped["Module"] = relationship(
        back_populates="quiz"
    )
    
    quizes_questions: Mapped[List["QuizQuestion"]] = relationship("QuizQuestion", back_populates='quiz')
    questions = association_proxy('questions_quizes', 'question', creator=lambda question: QuizQuestion(question=question))
    users_quizes: Mapped[List["UserQuiz"]] = relationship("UserQuiz", back_populates='quiz')
    users = association_proxy('users_quizes', 'user', creator=lambda user: UserQuiz(user=user))
    users_quizes_answers: Mapped[List["UserQuizAnswer"]] = relationship("UserQuizAnswer", back_populates='quiz')