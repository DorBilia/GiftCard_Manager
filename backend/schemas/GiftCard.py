from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional


class GiftCardBase(BaseModel):
    id: str
    name: str
    model_config = ConfigDict(from_attributes=True)


class GiftCardOverview(GiftCardBase):
    balance: float
    expr_date: date


class CompleteGiftCard(GiftCardOverview):
    card_number: str
    details: Optional[str] = None


class RemovedGiftCardOverview(GiftCardBase):
    removed_reason: str


class GiftCardResponse(BaseModel):
    id: str
    name: str
    card_number: str
    balance: float
    expr_date: date
    details: Optional[str] = None


class CreateGiftCardRequest(BaseModel):
    name: str
    card_number: str
    balance: float
    expr_date: date
