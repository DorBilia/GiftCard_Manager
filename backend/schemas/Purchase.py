from datetime import date
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class PurchaseSchema(BaseModel):
    id: str
    amount: float
    date: date
    details: Optional[str] = None
    store: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PurchaseResponse(BaseModel):
    id: str
    card_id: str
    amount: float
    date: date
    details: Optional[str] = None
    store: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class GiftCardPurchasesResponse(BaseModel):
    card_id: str
    purchases: List[PurchaseSchema]


class PurchaseRequest(BaseModel):
    card_id: str
    amount: float
    date: date
    details: Optional[str] = None
    store: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

