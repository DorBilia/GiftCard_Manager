import uuid

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import select

from db.database import get_db
from models.GiftCard import GiftCard
from schemas.GiftCard import GiftCardOverview, CompleteGiftCard, CreateGiftCardRequest, GiftCardResponse, \
    RemovedGiftCardOverview

router = APIRouter(
    prefix="/gift_card",
    tags=["GiftCard"]
)


@router.get("/active_gift_cards", response_model=List[GiftCardOverview])
def get_all_gift_cards(db: Session = Depends(get_db)):
    stmt = select(GiftCard).where(GiftCard.isActive)
    res = db.scalars(stmt).all()  # get list of objects
    return res


@router.get("/historical_gift_cards", response_model=List[RemovedGiftCardOverview])
def get_all_historical_gift_cards(db: Session = Depends(get_db)):
    stmt = select(GiftCard).where(GiftCard.isActive == False)
    res = db.scalars(stmt).all()
    return res


@router.post("/create", response_model=GiftCardResponse)
def create_gift_card(request: CreateGiftCardRequest, db: Session = Depends(get_db)):
    card_id = str(uuid.uuid4())
    card = GiftCard(id=card_id,
                    name=request.name,
                    card_number=request.card_number,
                    balance=request.balance,
                    expr_date=request.expr_date)
    try:
        db.add(card)
        db.commit()
        return card
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/gift_cards/{card_id}", response_model=CompleteGiftCard)
def get_gift_card(card_id: str, db: Session = Depends(get_db)):
    stmt = select(GiftCard).where(GiftCard.id == card_id)
    card = db.scalars(stmt).first()
    if card is None:
        raise HTTPException(status_code=404, detail="Card Not Found")
    else:
        return card


@router.put("/gift_cards/{card_id}", response_model=CompleteGiftCard)
def update_gift_card(request: CompleteGiftCard, db: Session = Depends(get_db)):
    try:
        old_card = db.get(GiftCard, request.id)
        update_data = request.model_dump()  # turn the request into a dict

        for key, value in update_data.items():
            setattr(old_card, key, value)

        db.commit()
        return old_card
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/gift_cards/{card_id}", response_model=CompleteGiftCard)
def delete_gift_card(card_id: str, db: Session = Depends(get_db)):
    try:
        card = db.query(GiftCard).filter_by(id=card_id).first()

        db.delete(card)
        db.commit()

        return card
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
