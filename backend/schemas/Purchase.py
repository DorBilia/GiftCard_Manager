from datetime import date
from typing import Optional, List

from pydantic import BaseModel


class PurchaseSchema(BaseModel):
    id: str
    amount: float
    date: date
    details: Optional[str] = None
    store: Optional[str] = None

    class Config:
        from_attributes = True


class GiftCardPurchasesResponse(BaseModel):
    id: str
    history: List[PurchaseSchema]

