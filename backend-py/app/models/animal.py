"""Animal model — direct port of Mongoose Animal schema."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User


ANIMAL_TYPES = ("cow", "buffalo", "goat", "chicken", "sheep", "pig", "other")
AGE_UNITS = ("months", "years")


class Animal(Base):
    __tablename__ = "animals"
    __table_args__ = (
        CheckConstraint(
            "type IN ('cow','buffalo','goat','chicken','sheep','pig','other')",
            name="ck_animals_type",
        ),
        CheckConstraint("age_unit IN ('months','years')", name="ck_animals_age_unit"),
        CheckConstraint("price >= 0", name="ck_animals_price_nonneg"),
        CheckConstraint("age >= 0", name="ck_animals_age_nonneg"),
        Index("ix_animals_type_price_created", "type", "price", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    images: Mapped[list[str]] = mapped_column(
        ARRAY(String), nullable=False, default=list, server_default="{}"
    )
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    age_unit: Mapped[str] = mapped_column(
        String(16), nullable=False, default="years", server_default="years"
    )
    location: Mapped[str] = mapped_column(String(128), nullable=False)

    breed: Mapped[str] = mapped_column(String(64), nullable=False, default="", server_default="")
    calving: Mapped[str] = mapped_column(String(32), nullable=False, default="", server_default="")
    milk_per_day: Mapped[str] = mapped_column(
        String(16), nullable=False, default="", server_default=""
    )
    description: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")

    seller_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    seller_phone: Mapped[str] = mapped_column(String(10), nullable=False)
    seller_name: Mapped[str] = mapped_column(String(128), nullable=False, default="", server_default="")

    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True, server_default="true", index=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    seller: Mapped["User"] = relationship(back_populates="animals", lazy="raise")
