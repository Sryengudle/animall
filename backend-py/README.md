# Pashubazaar Backend — Python (FastAPI + PostgreSQL)

Python rewrite of the original Node/Express/Mongo backend. **Wire-compatible** — the frontend works against this with zero code changes.

Architecture details + migration plan: see [`PLAN.md`](./PLAN.md).

---

## Quick start (local)

Prerequisites:
- Python 3.12+ (3.13 used during build)
- PostgreSQL running locally (Homebrew `postgresql@15` or newer)
- `uv` for dependency management

```sh
# 1. Create the database (one-time)
createdb -h localhost pashubazaar_dev

# 2. Virtualenv + deps
uv venv --python 3.13
uv pip install -e .

# 3. Run migrations
.venv/bin/alembic upgrade head

# 4. Start the API
.venv/bin/uvicorn app.main:app --reload --port 5001
```

Server is now on **http://localhost:5001**. The frontend's Vite proxy at `frontend/vite.config.js` is already pointed here.

> **Note on port 5000**: macOS AirPlay receiver squats on port 5000. We use 5001 in dev. Either disable AirPlay (System Settings → General → AirDrop & Handoff → AirPlay Receiver: Off) to reclaim 5000, or just keep 5001.

---

## Verify it works

```sh
./scripts/smoke_test.sh
```

Hits every endpoint, asserts Node-compatible response shape, prints green checkmarks. To test through the frontend's Vite proxy instead:

```sh
BASE=http://localhost:5174 ./scripts/smoke_test.sh
```

---

## Endpoint surface (identical to Node backend)

| Method | Path | Auth |
|---|---|---|
| GET | `/api/health` | — |
| POST | `/api/auth/send-otp` | — (rate-limited 5/15min) |
| POST | `/api/auth/verify-otp` | — |
| PUT | `/api/auth/profile` | Bearer |
| GET | `/api/animals` | — |
| GET | `/api/animals/my/listings` | Bearer |
| GET | `/api/animals/:id` | — |
| POST | `/api/animals` | Bearer (multipart, up to 5 images) |
| DELETE | `/api/animals/:id` | Bearer |
| GET | `/uploads/*` | — (static images) |

FastAPI also auto-generates **interactive API docs** at:
- http://localhost:5001/docs (Swagger UI)
- http://localhost:5001/redoc (ReDoc)

---

## Project structure

```
backend-py/
├── PLAN.md                        Architecture + migration plan
├── pyproject.toml                 Deps + tooling
├── .env / .env.example            Local secrets
├── alembic/
│   ├── env.py                     Async migration runner
│   └── versions/0001_initial.py   First migration (users + animals)
├── app/
│   ├── main.py                    FastAPI app, CORS, static mounts
│   ├── config.py                  pydantic-settings (env vars)
│   ├── db.py                      Async engine + session factory
│   ├── deps.py                    `CurrentUserDep`, `SessionDep`
│   ├── security.py                JWT encode/decode, phone validation
│   ├── serializers.py             Node-compatible JSON shapes (`_id`, camelCase)
│   ├── models/                    SQLAlchemy 2.0 mapped classes
│   ├── schemas/                   Pydantic request bodies
│   ├── routes/                    auth, animals, health
│   └── services/                  otp (demo + MSG91 stub), storage (local disk)
├── scripts/
│   └── smoke_test.sh              End-to-end curl test of all 9 endpoints
└── uploads/                       Local image storage (gitignored)
```

---

## What's the same as the Node backend

- All endpoint paths, query params, body shapes
- JWT shape (`{ id: <uuid>, exp: <unix> }`, HS256, 30-day TTL)
- Response field names — including `_id` aliased from UUID, `createdAt`/`updatedAt`/`ageUnit`/`milkPerDay`/`sellerId`/`sellerPhone`/`sellerName`/`isActive` camelCase
- Multer-style image upload (5 MB max, jpg/png/webp), saved to `/uploads/<timestamp>-<random>.<ext>`
- OTP rate limit (5 per 15 min)
- Demo OTP returned in response body when `SMS_PROVIDER=demo`

## What's different (under the hood, frontend doesn't see)

- IDs are UUIDs (36 chars) instead of MongoDB ObjectIds (24 chars). Frontend treats them as opaque strings — no impact.
- Phone validation enforced at DB layer (`CHECK` constraint), not just Mongoose.
- Animal type / age_unit also enforced at DB layer.
- Foreign key with `ON DELETE CASCADE` from animals to users.
- Composite index `(type, price, created_at)` ported from the Mongo index.

---

## Daily commands

```sh
# Start the API (auto-reload on file changes)
.venv/bin/uvicorn app.main:app --reload --port 5001

# Create a new migration after model changes
.venv/bin/alembic revision --autogenerate -m "add foo column"

# Apply migrations
.venv/bin/alembic upgrade head

# Roll back the last migration
.venv/bin/alembic downgrade -1

# Open a psql shell
psql -h localhost -d pashubazaar_dev
```

---

## Deployment (when ready)

Recommended path:

1. **Database**: Supabase free tier — copy the connection string into `DATABASE_URL`.
2. **API**: Railway or Render. Both have one-click Python + uv deploys.
3. **Static images**: V1 keeps `/uploads` on disk (fine for low volume); V2 switch `app/services/storage.py` to write to Cloudflare R2.
4. **OTP**: flip `SMS_PROVIDER=msg91` and wire `services/otp.py` to call MSG91's send-OTP API (the function signature is ready for this).
5. **Migrations**: run `alembic upgrade head` as part of the deploy script.

See `PLAN.md` for the full migration path from the existing Node + Mongo backend.
