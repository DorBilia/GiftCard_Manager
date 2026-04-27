from sqlalchemy import update

from db.database import SessionLocal
from models.GiftCard import GiftCard
from datetime import date
from core.settings import removedData


def archive_expired_cards():
    db = SessionLocal()
    try:
        with db.begin():
            expired = (
                update(GiftCard)
                .where(GiftCard.expr_date < date.today())
                .values(removedData["expired"])
            )
            db.execute(expired)
    finally:
        db.close()


def update_card_balance(card_id: str, amount: float):
    db = SessionLocal()
    try:
        with db.begin():
            card = db.get(GiftCard, card_id)
            if not card:
                return None
            if card.balance < amount:
                return False
            card.balance -= amount
            if card.balance == 0:
                for key, value in removedData["empty"].items():
                    setattr(card, key, value)
            return True
    finally:
        db.close()

