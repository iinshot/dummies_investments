from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession

engine = create_async_engine('postgresql+asyncpg://postgres:postgres@db/dummies_investments')

SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit=False)

def get_db() -> AsyncSession:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()