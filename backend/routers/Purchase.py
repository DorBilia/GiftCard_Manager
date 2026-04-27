import uuid

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
    statement = select(Purchase)
    purchases = db.scalars(statement).all()
    response = GiftCardPurchasesResponse(card_id=card_id, purchases=purchases)
    return response


@router.post("/{card_id}/create", response_model=PurchaseResponse)
def create_purchase(request: PurchaseRequest, db: Session = Depends(get_db)):
    id = str(uuid.uuid4())
    purchase = Purchase(id=id, **request.dict())
    try:
        db.add(purchase)
        db.commit()
        update_status = update_card_balance(request.card_id, request.amount)
        if update_status is None:
            raise HTTPException(status_code=404, detail="Card Not Found")
        if not update_status:
            raise HTTPException(status_code=400, detail="Amount too high")
        return purchase
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
