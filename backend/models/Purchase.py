from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from sqlalchemy.sql import func
from db.database import Base


class Purchase(Base):
    __tablename__ = 'purchases'
    id = Column(Integer, primary_key=True, index=True)
    giftCardId = Column(String, ForeignKey('gift_cards.id'), index=True)
    amount = Column(Float)
    date = Column(Date, default=func.now(), nullable=False)
    details = Column(String)
    store = Column(String)
