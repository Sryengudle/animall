"""User model — direct port of Mongoose User schema."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.animal import Animal


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("phone ~ '^[6-9][0-9]{9}$'", name="ck_users_phone_format"),
    )

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone: Mapped[str] = mapped_column(String(10), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False, default="", server_default="")
    location: Mapped[str] = mapped_column(String(128), nullable=False, default="", server_default="")

    otp: Mapped[str | None] = mapped_column(String(6), nullable=True)
    otp_expiry: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    animals: Mapped[list["Animal"]] = relationship(back_populates="seller", lazy="raise")
