from fastapi import FastAPI
import uvicorn

from db.session import engine, get_db
from sqlalchemy import select
from models import Base

# Should use alembic for migrations but figured it'd be too much trouble to run migrations
# by hand for all of us especially fronts who don't have anything to do with db so for now:
# try statement for compatability with tests
try:
    Base.metadata.create_all(bind=engine)
except:
    ...

app = FastAPI(root_path="/api")

@app.get("/")
async def root():
    return {"message": "Hello"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80)