from typing import List, Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import JSON

from . import Base, UserArticle

class Article(Base):
    __tablename__ = "articles"

    id_article: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(63))
    content: Mapped[JSON] = mapped_column(JSON)
    module: Mapped["Module"] = relationship(
        back_populates="articles"
    )
    id_module: Mapped[int] = mapped_column(ForeignKey("modules.id_module"), nullable=False)
    quiz: Mapped["Quiz"] = relationship(
        back_populates="article"
    )
    id_quiz: Mapped[Optional[int]] = mapped_column(ForeignKey("quizes.id_quiz"))
    users_articles: Mapped[List["UserArticle"]] = relationship("UserArticle", back_populates='article')
    users = association_proxy('users_articles', 'user', creator=lambda user: UserArticle(user=user))