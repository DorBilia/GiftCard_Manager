from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI

from core.CardManager import archive_expired_cards


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = BackgroundScheduler(timezone="Asia/Jerusalem")
    scheduler.add_job(archive_expired_cards, 'cron', hour=0, minute=30)
    scheduler.start()

    yield

    scheduler.shutdown()
