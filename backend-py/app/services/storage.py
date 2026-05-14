"""File storage — local disk in V1. R2/S3 swap point is right here."""
import random
from datetime import datetime
from pathlib import Path

import aiofiles
from fastapi import HTTPException, UploadFile

UPLOAD_ROOT = Path(__file__).resolve().parents[2] / "uploads"
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTS = {"jpg", "jpeg", "png", "webp"}
MAX_BYTES = 5 * 1024 * 1024  # 5 MB


def _ext_of(filename: str) -> str:
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""


async def save_image(file: UploadFile) -> str:
    """Save one uploaded image to disk and return the public URL path (e.g. /uploads/...).

    Mirrors the Multer disk-storage pattern: timestamp + random suffix, original extension.
    """
    if not file.filename:
        raise HTTPException(400, "Empty file")

    ext = _ext_of(file.filename)
    if ext not in ALLOWED_EXTS:
        raise HTTPException(400, "Images only (jpg, png, webp)")

    timestamp = int(datetime.now().timestamp() * 1000)
    suffix = random.randint(0, 10**9)
    unique = f"{timestamp}-{suffix:09d}.{ext}"
    out_path = UPLOAD_ROOT / unique

    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(400, "File too large (max 5 MB)")

    async with aiofiles.open(out_path, "wb") as f:
        await f.write(content)

    return f"/uploads/{unique}"
