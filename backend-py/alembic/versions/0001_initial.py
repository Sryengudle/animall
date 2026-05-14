"""initial schema: users + animals

Revision ID: 0001_initial
Revises:
Create Date: 2026-05-13
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "0001_initial"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("phone", sa.String(length=10), nullable=False, unique=True),
        sa.Column("name", sa.String(length=128), nullable=False, server_default=""),
        sa.Column("location", sa.String(length=128), nullable=False, server_default=""),
        sa.Column("otp", sa.String(length=6), nullable=True),
        sa.Column("otp_expiry", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("phone ~ '^[6-9][0-9]{9}$'", name="ck_users_phone_format"),
    )
    op.create_index("ix_users_phone", "users", ["phone"], unique=True)

    op.create_table(
        "animals",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("type", sa.String(length=16), nullable=False),
        sa.Column(
            "images",
            postgresql.ARRAY(sa.String()),
            nullable=False,
            server_default=sa.text("'{}'::varchar[]"),
        ),
        sa.Column("price", sa.Integer(), nullable=False),
        sa.Column("age", sa.Integer(), nullable=False),
        sa.Column("age_unit", sa.String(length=16), nullable=False, server_default="years"),
        sa.Column("location", sa.String(length=128), nullable=False),
        sa.Column("breed", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("calving", sa.String(length=32), nullable=False, server_default=""),
        sa.Column("milk_per_day", sa.String(length=16), nullable=False, server_default=""),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column(
            "seller_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("seller_phone", sa.String(length=10), nullable=False),
        sa.Column("seller_name", sa.String(length=128), nullable=False, server_default=""),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint(
            "type IN ('cow','buffalo','goat','chicken','sheep','pig','other')",
            name="ck_animals_type",
        ),
        sa.CheckConstraint("age_unit IN ('months','years')", name="ck_animals_age_unit"),
        sa.CheckConstraint("price >= 0", name="ck_animals_price_nonneg"),
        sa.CheckConstraint("age >= 0", name="ck_animals_age_nonneg"),
    )
    op.create_index("ix_animals_type", "animals", ["type"])
    op.create_index("ix_animals_seller_id", "animals", ["seller_id"])
    op.create_index("ix_animals_is_active", "animals", ["is_active"])
    op.create_index(
        "ix_animals_type_price_created",
        "animals",
        ["type", "price", "created_at"],
    )


def downgrade() -> None:
    op.drop_table("animals")
    op.drop_table("users")
