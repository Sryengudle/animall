"""JWT encode/decode + phone validation helpers.

The token payload shape is intentionally identical to the Node backend:
    { "id": "<uuid>", "exp": <unix ts> }
so the frontend's existing JWT handling continues to work.
"""
import re
from datetime import UTC, datetime, timedelta

from jose import JWTError, jwt

from app.config import settings

PHONE_RE = re.compile(r"^[6-9]\d{9}$")


def is_valid_phone(phone: str) -> bool:
    return bool(phone and PHONE_RE.match(phone))


def create_jwt(user_id: str) -> str:
    expire = datetime.now(UTC) + timedelta(days=settings.jwt_ttl_days)
    return jwt.encode(
        {"id": user_id, "exp": int(expire.timestamp())},
        settings.jwt_secret,
        algorithm=settings.jwt_alg,
    )


def decode_jwt(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_alg])
    except JWTError:
        return None
