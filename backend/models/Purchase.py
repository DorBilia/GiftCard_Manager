from sqlalchemy import Column, String, Date, ForeignKey, Float
from datetime import date
from db.database import Base


class Purchase(Base):
    __tablename__ = 'purchases'
    id = Column(String, primary_key=True, index=True)
    card_id = Column(String, ForeignKey('gift_cards.id'), index=True)
    amount = Column(Float, nullable=False)
    date = Column(Date, default=date.today(), nullable=False)
    details = Column(String, default=None)
    store = Column(String, default=None)
