from typing import Optional, Sequence
from sqlalchemy.orm import Session
from abc import ABC, abstractmethod


class AbstractRepo(ABC):
    db: Session

    def __init__(self, db: Session):
        self.db = db

    @abstractmethod
    def create(self, **kwargs) -> object:
        pass

    @abstractmethod
    def get_by_id(self, id: int) -> Optional[object]:
        pass

    @abstractmethod
    def get_all(self) -> Sequence[object]:
        pass

    @abstractmethod
    def update(self, id: int, **updates) -> Optional[object]:
        pass

    @abstractmethod
    def delete(self, biror_id: int) -> bool:
        pass
