"""FastAPI app entrypoint.

Wires CORS, static uploads, rate limit handler, and the three route modules
(`auth`, `animals`, `health`). The routes are mounted under `/api/*` and
`/uploads/*` exactly like the Node backend, so the existing frontend works
with no code changes.
"""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.routes import animals as animals_routes
from app.routes import auth as auth_routes
from app.routes import health as health_routes

UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Place for DB warm-up / connection pool checks if needed later.
    yield


app = FastAPI(
    title="Pashubazaar API",
    version="0.1.0",
    lifespan=lifespan,
)

# Wire slowapi's limiter (used by routes/auth.py via decorator)
app.state.limiter = auth_routes.limiter


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(_, exc):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=429,
        content={"message": "Too many OTP requests, try after 15 minutes"},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(health_routes.router, prefix="/api")
app.include_router(auth_routes.router, prefix="/api/auth")
app.include_router(animals_routes.router, prefix="/api/animals")
