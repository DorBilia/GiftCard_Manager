from fastapi import FastAPI
from core.lifespan import lifespan
from fastapi.middleware.cors import CORSMiddleware
from core.settings import settings
from routers import GiftCard, Purchase
from db.database import create_tables

create_tables()

app = FastAPI(
    title="GiftCard Manger API",
    description="api to manage GiftCards",
    version="0.2.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(Purchase.router, prefix=settings.API_PREFIX)

app.include_router(GiftCard.router, prefix=settings.API_PREFIX)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
