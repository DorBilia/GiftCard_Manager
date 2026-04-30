import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import select

from db.database import get_db
from models.Purchase import Purchase
from schemas.Purchase import GiftCardPurchasesResponse, PurchaseRequest, PurchaseResponse
from core.CardManager import update_card_balance

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
    update_result = update_card_balance(request.card_id, purchase, request.amount)

    if update_result == -1:
        raise HTTPException(status_code=404, detail="Card Not Found")

    if update_result == -2:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    if isinstance(update_result, Exception):
        raise HTTPException(status_code=500, detail=str(update_result))

    return update_result
