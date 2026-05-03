from typing import Optional, List, Sequence

from sqlalchemy import select, update

from Repositories.AbstractRepo import AbstractRepo
from db.models.GiftCard import GiftCard


class GiftCardRepository(AbstractRepo):

    def create(self, **kwargs):
        card = GiftCard(kwargs)
        self.db.add(card)
        self.db.commit()
        self.db.refresh(card)
        return card

    def get_by_id(self, id: int) -> object:
        stmt = select(GiftCard).where(GiftCard.id == id)
        card = self.db.scalars(stmt).first()
        return card

    def get_all(self) -> Sequence[GiftCard]:  # Look for it, maybe change to List
        stmt = select(GiftCard)
        res = self.db.scalars(stmt).all()
        return res

    def update(self, id: int, **updates) -> Optional[object]:
        query = (
            update(GiftCard)
            .where(GiftCard.id == id)
            .values(**updates)
            .execution_options(synchronize_session=False)
        )
        self.db.execute(query)
        self.db.commit()
        return self.get_by_id(id)

    def delete(self, id: int) -> object:
        card = self.db.query(GiftCard).filter_by(id=id).first()

        self.db.delete(card)

        self.db.commit()

        return card
