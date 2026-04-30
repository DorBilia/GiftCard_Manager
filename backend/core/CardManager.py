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


def update_card_balance(card_id: str, purchase: Purchase, deletedPurchase: bool = False):
    # Deleted purchase: whether a purchase is being deleted, in that case the card needs to be compensated
    db = SessionLocal()
    try:
        card = db.get(GiftCard, card_id)
        amount = purchase.amount
        if not card:
            return -1

        if card.balance < amount:
            return -2

        if amount <= 0 and not deletedPurchase:
            return -3

        if deletedPurchase:
            card.balance += amount
            if not card.isActive and card.balance > 0:  # The purchase was deleted on a historical card
                card.isActive = False
                card.removed_reason = None
        else:
            card.balance -= amount

        if card.balance == 0:
            for key, value in removedData["empty"].items():
                setattr(card, key, value)

        if not deletedPurchase:
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
