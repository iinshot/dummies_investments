from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from . import Base

class UserModule(Base):
    __tablename__ = "users_modules"

    id_user: Mapped[int] = mapped_column(ForeignKey("users.id_user"), primary_key=True)
    id_module: Mapped[int] = mapped_column(ForeignKey("modules.id_module"), primary_key=True)

    user = relationship('User', back_populates='users_modules')
    module = relationship('Module', back_populates='users_modules')