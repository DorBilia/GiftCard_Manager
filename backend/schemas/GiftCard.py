from pydantic import BaseModel
from datetime import date
from typing import List, Optional


class GiftCardOverview(BaseModel):
    id: str
    name: bool = True
    balance: float
    expr_date: date

    class Config:
        from_attributes = True


class CompleteGiftCard(GiftCardOverview):
    card_number: str
    details: Optional[str] = None



