from fastapi import FastAPI, APIRouter
from fastapi.openapi.utils import get_openapi
import uvicorn

app = FastAPI(root_path="/api", openapi_url="/openapi.json")

@app.get("/")
async def root():
    return {"message": "Hello"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80)