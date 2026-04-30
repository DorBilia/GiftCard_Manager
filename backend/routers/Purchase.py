import uuid

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import select

from db.database import get_db
from models.Purchase import Purchase
from schemas.Purchase import GiftCardPurchasesResponse, PurchaseRequest, PurchaseResponse
from core.CardManager import update_card_balance, update_card_upon_purchase_deletion

router = APIRouter(
    prefix="/purchase",
    tags=["Purchase"]
)


@router.get("/{card_id}/history", response_model=GiftCardPurchasesResponse)
def get_purchases(card_id: str, db: Session = Depends(get_db)):
    stmt = select(Purchase).where(Purchase.card_id == card_id)
    purchases = db.scalars(stmt).all()
    response = GiftCardPurchasesResponse(card_id=card_id, purchases=purchases)
    return response


@router.post("/{card_id}/create", response_model=PurchaseResponse)
def create_purchase(request: PurchaseRequest):
    purchase = Purchase(
        id=str(uuid.uuid4()),
        card_id=request.card_id,
        amount=request.amount,
        date=request.date,
        details=request.details,
        store=request.store
    )
    update_result = update_card_balance(request.card_id, purchase)

    match update_result:
        case -1:
            raise HTTPException(status_code=404, detail="Card Not Found")
        case -2:
            raise HTTPException(status_code=400, detail="Insufficient funds")
        case -3:
            raise HTTPException(status_code=400, detail="Amount must be greater then 0")
        case _:
            pass

    if isinstance(update_result, Exception):
        raise HTTPException(status_code=500, detail=str(update_result))

    return update_result


@router.delete("/{purchase_id}", response_model=PurchaseResponse)
def delete_purchase(purchase_id: str, db: Session = Depends(get_db)):
    try:

        purchase = db.get(Purchase, purchase_id)

        if not purchase:
            raise HTTPException(status_code=404, detail="Purchase not found")

        update_card_upon_purchase_deletion(purchase, db)

        db.delete(purchase)

        db.commit()

        return purchase

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
