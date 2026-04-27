from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional


class GiftCardOverview(BaseModel):
    id: str
    name: str
    balance: float
    expr_date: date

    model_config = ConfigDict(from_attributes=True)


class GiftCardResponse(BaseModel):
    id: str
    name: str
    card_number: str
    balance: float
    expr_date: date
    details: Optional[str] = None


class CompleteGiftCard(GiftCardOverview):
    card_number: str
    details: Optional[str] = None


class CreateGiftCardRequest(BaseModel):
    name: str
    card_number: str
    balance: float
    expr_date: date
