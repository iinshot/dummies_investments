from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

engine = create_engine('postgresql+psycopg2://postgres:postgres@db/dummies_investments')

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()