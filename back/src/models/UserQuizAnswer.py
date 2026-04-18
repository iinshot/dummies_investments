from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from . import Base

class UserQuizAnswer(Base):
    __tablename__ = "users_quizes_answers"

    id_user: Mapped[int] = mapped_column(ForeignKey("users.id_user"), primary_key=True)
    id_quiz: Mapped[int] = mapped_column(ForeignKey("quizes.id_quiz"), primary_key=True)
    id_answer: Mapped[int] = mapped_column(ForeignKey("answers.id_answer"), primary_key=True)

    user = relationship('User', back_populates='users_quizes_answers')
    quiz = relationship('Quiz', back_populates='users_quizes_answers')
    answer = relationship('Answer', back_populates='users_quizes_answers')