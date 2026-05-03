from typing import Optional, Sequence

from sqlalchemy import select, update

from Repositories.AbstractRepo import AbstractRepo
from db.models.Purchase import Purchase


class PurchaseRepository(AbstractRepo):

    def create(self, **kwargs):
        card = Purchase(kwargs)
        self.db.add(card)
        self.db.commit()
        self.db.refresh(card)
        return card

    def get_by_id(self, id: int) -> object:
        stmt = select(Purchase).where(Purchase.id == id)
        card = self.db.scalars(stmt).first()
        return card

    def get_all(self) -> Sequence[Purchase]:  # Look for it, maybe change to List
        stmt = select(Purchase)
        res = self.db.scalars(stmt).all()
        return res

    def update(self, id: int, **updates) -> Optional[object]:
        query = (
            update(Purchase)
            .where(Purchase.id == id)
            .values(**updates)
            .execution_options(synchronize_session=False)
        )
        self.db.execute(query)
        self.db.commit()
        return self.get_by_id(id)

    def delete(self, id: int) -> object:
        card = self.db.query(Purchase).filter_by(id=id).first()

        self.db.delete(card)

        self.db.commit()

        return card
