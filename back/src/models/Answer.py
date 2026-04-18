from typing import List
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
import enum

from . import Base
from .UserQuizAnswer import UserQuizAnswer

class Answer(Base):
    __tablename__ = "answers"

    id_answer: Mapped[int] = mapped_column(primary_key=True)
    id_question: Mapped[int] = mapped_column(ForeignKey("questions.id_question"))
    answer_text: Mapped[str] = mapped_column(String(1023))
    is_correct: Mapped[bool] = mapped_column(nullable=False)
    question: Mapped["Question"] = relationship(back_populates='answers')
    
    users_quizes_answers: Mapped[List["UserQuizAnswer"]] = relationship("UserQuizAnswer", back_populates='answer')