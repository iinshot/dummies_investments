from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from . import Base

class UserArticle(Base):
    __tablename__ = "users_articles"

    id_user: Mapped[int] = mapped_column(ForeignKey("users.id_user"), primary_key=True)
    id_article: Mapped[int] = mapped_column(ForeignKey("articles.id_article"), primary_key=True)
    is_read: Mapped[bool] = mapped_column(default=False)
    last_checkpoint: Mapped[int] = mapped_column(default=0)

    user = relationship('User', back_populates='users_articles')
    article = relationship('Article', back_populates='users_articles')