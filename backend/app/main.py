from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.trace import router as trace_router

app = FastAPI(title="File Tracer", docs_url="/api/docs", openapi_url="/api/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trace_router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
