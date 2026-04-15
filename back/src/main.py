from fastapi import FastAPI
import uvicorn

from db.session import engine, get_db
from models import Base, User, Article, Module
from sqlalchemy import select

Base.metadata.create_all(bind=engine)

app = FastAPI(root_path="/api")

@app.get("/")
async def root():
    return {"message": "Hello"}

if __name__ == "__main__":
    db = get_db()
    session = next(db)
    tm = Module(name="Alice")
    ta = Article(name="Bob", content="{}", module=tm)
    session.add(tm)
    session.add(ta)
    session.commit()
    a = session.scalars(select(Article)).all()[0].module
    print(a.name)
    uvicorn.run(app, host="0.0.0.0", port=80)