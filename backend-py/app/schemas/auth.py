"""Pydantic request bodies for auth endpoints."""
from pydantic import BaseModel, Field


class SendOtpIn(BaseModel):
    phone: str = Field(..., min_length=10, max_length=10)


class VerifyOtpIn(BaseModel):
    phone: str = Field(..., min_length=10, max_length=10)
    otp: str = Field(..., min_length=6, max_length=6)


class UpdateProfileIn(BaseModel):
    name: str | None = None
    location: str | None = None
