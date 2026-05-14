"""Auth endpoints — mirror /api/auth/* from the Node backend exactly."""
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy import select

from app.deps import CurrentUserDep, SessionDep
from app.models.user import User
from app.schemas.auth import SendOtpIn, UpdateProfileIn, VerifyOtpIn
from app.security import create_jwt, is_valid_phone
from app.serializers import serialize_user, serialize_user_compact
from app.services.otp import generate_otp, include_otp_in_response, send_otp

router = APIRouter(tags=["auth"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/send-otp")
@limiter.limit("5/15minutes")
async def send_otp_route(request: Request, body: SendOtpIn, db: SessionDep) -> dict:
    if not is_valid_phone(body.phone):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid phone number")

    otp = generate_otp()
    expiry = datetime.now(UTC) + timedelta(minutes=5)

    result = await db.execute(select(User).where(User.phone == body.phone))
    user = result.scalar_one_or_none()

    if user is None:
        user = User(phone=body.phone, otp=otp, otp_expiry=expiry)
        db.add(user)
    else:
        user.otp = otp
        user.otp_expiry = expiry

    await db.commit()
    await send_otp(body.phone, otp)

    response: dict = {"message": "OTP sent"}
    if include_otp_in_response():
        response["demo_otp"] = otp
    return response


@router.post("/verify-otp")
async def verify_otp_route(body: VerifyOtpIn, db: SessionDep) -> dict:
    if not body.phone or not body.otp:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Phone and OTP required")

    result = await db.execute(select(User).where(User.phone == body.phone))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    now = datetime.now(UTC)
    if user.otp != body.otp or user.otp_expiry is None or user.otp_expiry < now:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired OTP")

    user.otp = None
    user.otp_expiry = None
    await db.commit()
    await db.refresh(user)

    return {"token": create_jwt(str(user.id)), "user": serialize_user_compact(user)}


@router.put("/profile")
async def update_profile(body: UpdateProfileIn, user: CurrentUserDep, db: SessionDep) -> dict:
    if body.name is not None:
        user.name = body.name
    if body.location is not None:
        user.location = body.location
    await db.commit()
    await db.refresh(user)
    return serialize_user(user)
