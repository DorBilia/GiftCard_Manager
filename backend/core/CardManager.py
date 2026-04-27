from sqlalchemy import update

from db.database import SessionLocal
from models.GiftCard import GiftCard
from models.Purchase import Purchase
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


def update_card_balance(card_id: str, purchase: Purchase, amount: float):
    db = SessionLocal()
    try:
        card = db.get(GiftCard, card_id)

        if not card:
            return -1

        if card.balance < amount:
            return -2

        card.balance -= amount
        if card.balance == 0:
            for key, value in removedData["empty"].items():
                setattr(card, key, value)

        db.add(purchase)

        db.commit()

        db.refresh(purchase)
        return purchase

    except Exception as e:
        db.rollback()
        return e

    finally:
        db.close()
