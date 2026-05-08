from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from . import Base

class UserQuiz(Base):
    __tablename__ = "users_quizes"

    id_user: Mapped[int] = mapped_column(ForeignKey("users.id_user"), primary_key=True)
    id_quiz: Mapped[int] = mapped_column(ForeignKey("quizes.id_quiz"), primary_key=True)
    is_completed: Mapped[bool] = mapped_column(default=False)

    user = relationship('User', back_populates='users_quizes')
    quiz = relationship('Quiz', back_populates='users_quizes')