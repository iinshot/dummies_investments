from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from . import Base, UserModule

class Module(Base):
    __tablename__ = "modules"

    id_module: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(63))
    articles: Mapped[List["Article"]] = relationship(
        back_populates="module", cascade="all, delete-orphan"
    )
    quiz: Mapped["Quiz"] = relationship(
        back_populates="module"
    )
    id_quiz: Mapped[Optional[int]] = mapped_column(ForeignKey("quizes.id_quiz"))
    users_modules: Mapped[List["UserModule"]] = relationship("UserModule", back_populates='module')
    users = association_proxy('users_modules', 'user', creator=lambda user: UserModule(user=user))