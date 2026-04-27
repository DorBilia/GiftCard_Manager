from sqlalchemy import Column, Integer, String, Date, Boolean
from db.database import Base


class GiftCard(Base):
    __tablename__ = "gift_cards"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    balance = Column(Integer, index=True, nullable=False)
    expr_date = Column(Date, index=True, nullable=False)
    card_number = Column(String, nullable=False)
    details = Column(String)
    isActive = Column(Boolean, default=True)
    removed_reason = Column(String)
