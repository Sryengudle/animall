"""FastAPI dependencies — current user, DB session."""
import uuid
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models.user import User
from app.security import decode_jwt

SessionDep = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(
    db: SessionDep,
    authorization: Annotated[str | None, Header()] = None,
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authorized")
    token = authorization.split(" ", 1)[1]

    payload = decode_jwt(token)
    if not payload or "id" not in payload:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token invalid")

    try:
        user_id = uuid.UUID(payload["id"])
    except (ValueError, TypeError):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token invalid") from None

    user = await db.get(User, user_id)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")
    return user


CurrentUserDep = Annotated[User, Depends(get_current_user)]
