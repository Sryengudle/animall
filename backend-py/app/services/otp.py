"""OTP generation + delivery.

V1: demo mode returns the OTP in the API response and logs to stdout.
V2: swap in MSG91 by setting SMS_PROVIDER=msg91 and wiring `send_via_msg91`.
"""
import logging
import secrets

from app.config import settings

log = logging.getLogger(__name__)


def generate_otp() -> str:
    """6-digit numeric OTP. Uses secrets.randbelow for cryptographic randomness."""
    return f"{secrets.randbelow(1_000_000):06d}"


async def send_otp(phone: str, otp: str) -> None:
    """Deliver the OTP. In demo mode just logs; in production calls SMS provider."""
    if settings.sms_provider == "demo":
        log.info("OTP for %s: %s", phone, otp)
        print(f"[demo SMS] OTP for {phone}: {otp}", flush=True)
        return

    # V2 hook — when MSG91 credentials are wired:
    # await send_via_msg91(phone, otp)
    raise NotImplementedError(f"SMS provider '{settings.sms_provider}' not implemented yet")


def include_otp_in_response() -> bool:
    """Only return the OTP in the API body when in demo mode (never in prod)."""
    return settings.sms_provider == "demo"
