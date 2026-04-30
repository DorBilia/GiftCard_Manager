from sqlalchemy import update
from sqlalchemy.orm import Session

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


def update_card_balance(card_id: str, purchase: Purchase):
    db = SessionLocal()
    try:
        card = db.get(GiftCard, card_id)
        amount = purchase.amount
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


def update_object(old_obj: object, update_request: object, db: Session):
    update_data = update_request.model_dump()

    for key, value in update_data.items():
        setattr(old_obj, key, value)
    db.commit()
    return old_obj


def update_card_upon_purchase_deletion(purchase: Purchase, db: Session):
    card = db.get(GiftCard, purchase.card_id)
    card.balance += purchase.amount

    if card.removed_reason == removedData["empty"][
        "removed_reason"]:  # Bring back empty cards from history if they are full again
        card.isActive = True
        card.removed_reason = None

    db.commit()
