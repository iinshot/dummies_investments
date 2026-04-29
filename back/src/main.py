from fastapi import FastAPI
import uvicorn
from db.session import engine, get_db
from sqlalchemy import select
from models import Base
from routes.module import router as module_router

try:
    Base.metadata.create_all(bind=engine)
except:
    ...

app = FastAPI(root_path="/api")

app.include_router(module_router)

@app.get("/")
async def root():
    return {"message": "Hello"}