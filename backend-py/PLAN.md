# Animall Backend — Python Rewrite Plan

> Architect lens. Decisive choices, why, and how to migrate without breaking the existing frontend (or the marketing site, when it goes live).

---

## TL;DR — the decisive picks

| Concern | Pick | Why (one line) |
|---|---|---|
| Language | **Python 3.12** | What you asked for; mature for APIs and future AI/ML |
| Framework | **FastAPI** | Async-first, type-safe via Pydantic, auto OpenAPI docs, dominant Python API framework today |
| Database | **PostgreSQL 16** | Right shape for this data, geographic search via PostGIS, ACID for future payments, `jsonb` when you want Mongo-like flex |
| ORM | **SQLAlchemy 2.0 (async) + Alembic** | Industry standard; Alembic gives proper migrations |
| Validation | **Pydantic v2** | Built into FastAPI; runtime + type-time validation in one |
| Auth | **JWT** (python-jose) | Same scheme as the Node backend — frontend doesn't change |
| OTP delivery | **MSG91** (V2) | India-focused, cheaper and more reliable than Twilio for Indian phones |
| File storage | Local disk (V1) → **Cloudflare R2** (V2) | Same pattern as Multer today; R2 is S3-compatible, free egress |
| Background jobs | **None** (V1) → **Celery + Redis** (V2+) | YAGNI; add when first job appears |
| Cache / OTP store | **PostgreSQL** (V1) → **Redis** (V2) | Same as current Node backend; only add Redis when justified |
| Hosting | **Railway** or **Render** | Python-friendly, managed Postgres add-on, ~$5/mo to start |
| API contract | **Identical** to current Node backend | Frontend ships zero code changes — pure swap |

**Single biggest architectural shift**: Mongoose → SQLAlchemy + PostgreSQL. Everything else (auth, OTP, JWT, file upload, routes) is a near-1:1 port.

---

## 1. Should you rewrite at all?

Worth saying out loud before we start. The Node backend works. Costs of a rewrite:

- ~2–3 weeks of dev time you're not spending on features
- Two systems in production during migration
- Data migration risk

Reasons that **justify** a Python rewrite for Animall specifically:

1. **Future AI/ML features** — breed identification from photos, price prediction, fraud detection. Python is the only realistic language for these.
2. **Type safety and validation** — FastAPI + Pydantic catches the kind of bug Express + plain JS misses. (Your current code already has shape-violation potential — e.g. `Number(price)` coercion silently failing.)
3. **Auto-generated OpenAPI docs** — the website's "public listings" feature in V2 will need API documentation; FastAPI gives this free.
4. **Hiring** — Python is more common in Indian agritech/data startups than Node.
5. **Operational simplicity** — PostgreSQL is easier to operate than MongoDB for a small team.

If none of those resonate, the right call may be **don't rewrite, just refactor the existing Node backend**. Tell me and I'll plan that instead.

Assumed answer for the rest of this doc: **yes, we rewrite.**

---

## 2. Database — why PostgreSQL beats MongoDB for Animall

You asked for the best DB. Honest answer: **PostgreSQL**, not MongoDB. Here's the reasoning per your actual data and queries.

### Your data is relational, not document-shaped

| Today's models | Tomorrow's models (very likely) |
|---|---|
| User | + Order / transaction |
| Animal (refs User as `sellerId`) | + Review / rating |
| | + Vet appointment |
| | + Feed purchase |
| | + Loan / insurance lead |

Every one of those is a `belongs_to` / `has_many` relationship. SQL was built for this. MongoDB makes you choose between embedding (denormalizing data, painful to update) or referencing (then doing joins manually with `$lookup` aggregations, slow and awkward).

### Your killer query is geographic

"Buffalo for sale **near me** in Pune." Today your `location` field is a freetext string — that's already a smell. The right shape:

- `district` — indexed varchar (for `/buy/buffalo/pune` SEO pages)
- `coordinates` — `geography(POINT, 4326)` with PostGIS

PostGIS gives you `ST_DWithin(coords, point, 10000)` (within 10 km) as a real indexed query. MongoDB has geo too, but PostGIS is more powerful and battle-tested for this exact use case.

### `jsonb` gives you Mongo flexibility when you want it

The argument for MongoDB is usually "schema flexibility." PostgreSQL has had `jsonb` columns since 2014 — fully indexed, queryable, schema-free. Use it for:

- Breed-specific fields that vary by animal type (chicken doesn't have `milkPerDay`, cow does)
- Experimental fields you're not ready to formalize

You get the strict-schema benefits for 90% of your data and the flex for the 10% that needs it.

### Operational reality

| Concern | PostgreSQL | MongoDB |
|---|---|---|
| Free hosted tier | Supabase, Neon, Railway, Render | Atlas free tier (limited) |
| Backups | Trivial (pg_dump) | More involved |
| Transactions | First-class since forever | Added late, with caveats |
| Migrations | Alembic — bulletproof | Mongoose schema is "best effort" |
| Future payments | ACID makes this safe | Possible but more careful |
| Local dev | `docker run postgres` | `docker run mongo` (tie) |

### My recommendation

**PostgreSQL 16 on Supabase free tier** for V1.

- Supabase gives you managed Postgres + auth + storage + dashboards. We only use the Postgres part.
- 500 MB DB free; ~50k listings worth.
- Zero credit card to start.
- Migrate to Neon or self-host when free tier outgrows.

If you have a strong preference for MongoDB anyway (familiarity, existing data, etc.), the Python stack still works — swap SQLAlchemy for Motor (async MongoDB driver) or Beanie (ODM). I'd argue against, but the rest of the plan doesn't change much.

---

## 3. API contract — keep it identical

The biggest risk in a rewrite is breaking the frontend. We avoid this by **mirroring the current Node API endpoint-for-endpoint, response-for-response.** Frontend ships zero changes.

### Endpoint inventory (from current Node backend)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/send-otp` | — | Body `{ phone }`. Rate-limited 5/15min. Returns `{ message, demo_otp }` (drop `demo_otp` when real SMS is wired) |
| POST | `/api/auth/verify-otp` | — | Body `{ phone, otp }`. Returns `{ token, user }` |
| PUT  | `/api/auth/profile` | Bearer | Body `{ name, location }`. Returns updated user |
| GET  | `/api/animals` | — | Query: `type, minPrice, maxPrice, page, limit`. Returns `{ animals, total, page, pages }` |
| GET  | `/api/animals/my/listings` | Bearer | Returns array of user's animals |
| GET  | `/api/animals/:id` | — | Single animal |
| POST | `/api/animals` | Bearer | Multipart: `images[]` + form fields. Returns created animal |
| DELETE | `/api/animals/:id` | Bearer | Soft delete |
| GET  | `/api/health` | — | `{ status: 'OK' }` |
| GET  | `/uploads/*` | — | Static-serve uploaded images |

### Response shapes to preserve

The frontend reads `animal._id` (Mongo ObjectId) today. To keep zero changes:

- In the Python backend, the SQL primary key is a UUID (string).
- Serialize it back to the frontend as `_id` — same field name, same string shape (UUID instead of ObjectId, but the frontend doesn't care; it's an opaque string).

Same trick for `createdAt` / `updatedAt` — emit ISO 8601 strings like Mongoose does.

This is a Pydantic alias config:

```python
class AnimalOut(BaseModel):
    id: UUID = Field(alias="_id", serialization_alias="_id")
    type: str
    ...
    created_at: datetime = Field(serialization_alias="createdAt")
    updated_at: datetime = Field(serialization_alias="updatedAt")

    model_config = ConfigDict(populate_by_name=True)
```

### New endpoints to add (Phase 2+ for the marketing website)

Already in the website plan but worth flagging here:

| Method | Path | Notes |
|---|---|---|
| GET | `/api/public/animals` | Same as `/api/animals` but **strips `sellerPhone`, masks `sellerName` to first name**. For the public marketing site. |
| GET | `/api/public/animals/:id` | Same field stripping |
| GET | `/api/public/stats` | Counts for trust strip on website |
| GET | `/api/public/sitemap-data` | For website's `sitemap.xml` |

These are pure read endpoints — easy to layer on once the Python backend is live.

---

## 4. Data model translation — Mongoose → SQLAlchemy

### Users

```python
class User(Base):
    __tablename__ = "users"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone        = Column(String(10), unique=True, index=True, nullable=False)
    name         = Column(String(128), default="")
    location     = Column(String(128), default="")
    district     = Column(String(64), index=True, nullable=True)   # NEW — for SEO/search
    coordinates  = Column(Geography("POINT", srid=4326), nullable=True)  # NEW — PostGIS
    otp          = Column(String(6), nullable=True)
    otp_expiry   = Column(DateTime(timezone=True), nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    listings     = relationship("Animal", back_populates="seller")
```

Phone validation moves into Pydantic (FastAPI), not the DB. Constraint: `CHECK (phone ~ '^[6-9][0-9]{9}$')`.

### Animals

```python
class Animal(Base):
    __tablename__ = "animals"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type         = Column(Enum("cow","buffalo","goat","chicken","sheep","pig","other", name="animal_type"), nullable=False, index=True)
    images       = Column(ARRAY(String), default=list)
    price        = Column(Integer, nullable=False)              # paisa? or rupees? lock down at port time
    age          = Column(Numeric(5,2), nullable=False)
    age_unit     = Column(Enum("months","years", name="age_unit"), default="years")
    location     = Column(String(128), nullable=False)
    district     = Column(String(64), index=True, nullable=True)   # NEW
    coordinates  = Column(Geography("POINT", srid=4326), nullable=True)   # NEW

    breed        = Column(String(64), default="")
    calving      = Column(String(32), default="")
    milk_per_day = Column(String(16), default="")
    description  = Column(Text, default="")

    # Schema-flex bucket for breed-specific fields that don't deserve a column yet.
    extras       = Column(JSONB, default=dict)

    seller_id    = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    seller_phone = Column(String(10), nullable=False)
    seller_name  = Column(String(128), default="")
    is_active    = Column(Boolean, default=True, index=True)

    created_at   = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at   = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    seller       = relationship("User", back_populates="listings")

    __table_args__ = (
        Index("ix_animals_type_price_created", "type", "price", "created_at"),
    )
```

The `__table_args__` index is the direct port of the Mongoose `{ type: 1, price: 1, createdAt: -1 }` index.

### What's new vs the Mongoose model

- `district` (indexed) — for SEO listing pages and faster city filters
- `coordinates` (PostGIS) — for radius search
- `extras` (JSONB) — schema-flex escape hatch
- Real foreign keys — `seller_id` referencing `users.id` with cascade rules

The frontend doesn't see any of this — old fields stay, new ones are additive.

---

## 5. Folder structure (the new `/backend-py/`)

```
backend-py/
├── PLAN.md                       ← this doc
├── pyproject.toml                ← deps + tooling (uv or poetry)
├── README.md
├── .env.example
├── alembic.ini
├── alembic/
│   └── versions/                 ← migration files
├── docker-compose.yml            ← local Postgres + (later) Redis
├── Dockerfile                    ← for deploy
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   └── test_animals.py
├── uploads/                      ← V1 local image storage (gitignored)
└── app/
    ├── main.py                   ← FastAPI app factory + middleware
    ├── config.py                 ← pydantic-settings; reads env vars
    ├── db.py                     ← SQLAlchemy engine + session
    ├── deps.py                   ← FastAPI dependencies (current_user, db)
    ├── security.py               ← JWT encode/decode, phone validation
    ├── models/
    │   ├── __init__.py
    │   ├── user.py
    │   └── animal.py
    ├── schemas/                  ← Pydantic models (request/response)
    │   ├── auth.py
    │   ├── user.py
    │   └── animal.py
    ├── routes/
    │   ├── auth.py
    │   ├── animals.py
    │   ├── public.py             ← /api/public/* (for the website)
    │   └── health.py
    ├── services/
    │   ├── otp.py                ← OTP generation + send
    │   ├── sms.py                ← MSG91 client (V2)
    │   ├── storage.py            ← local disk now, R2 later
    │   └── users.py              ← repository pattern for user data
    └── core/
        ├── ratelimit.py          ← slowapi setup (FastAPI's express-rate-limit equivalent)
        └── errors.py             ← global exception handlers
```

The shape mirrors the Node backend's mental model (`routes/`, `models/`, `middleware/`) so anyone reading both sees the same map.

---

## 6. Tooling — dependencies and dev workflow

### `pyproject.toml` essentials

```toml
[project]
name = "animall-backend"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "fastapi[standard]>=0.110",
  "uvicorn[standard]>=0.29",
  "sqlalchemy[asyncio]>=2.0",
  "alembic>=1.13",
  "asyncpg>=0.29",                     # postgres async driver
  "pydantic>=2.6",
  "pydantic-settings>=2.2",
  "python-jose[cryptography]>=3.3",    # JWT
  "passlib[bcrypt]>=1.7",              # if we ever need password hashing
  "python-multipart>=0.0.9",           # FastAPI form/file uploads
  "slowapi>=0.1.9",                    # rate limiting
  "geoalchemy2>=0.14",                 # PostGIS bindings
  "httpx>=0.27",                       # for MSG91 calls later
]

[project.optional-dependencies]
dev = [
  "pytest>=8",
  "pytest-asyncio>=0.23",
  "ruff>=0.4",
  "mypy>=1.10",
  "respx>=0.21",                       # HTTP mocking for tests
]
```

### Package manager: **uv** (fast) or **poetry** (familiar)

Recommend **uv** — written in Rust, 10–100× faster than poetry, and reads pyproject.toml directly. `uv pip install` and `uv run` are the daily commands.

### Linting + type checking

- **Ruff** for lint + format (replaces flake8, black, isort).
- **Mypy** in strict mode on `app/` — type errors fail CI.

---

## 7. OTP delivery — production path

Current Node backend returns the OTP in the response (`demo_otp`) — fine for dev, a security hole in prod. The Python rewrite is the right moment to fix this.

| Provider | Pros | Cons | India OTP cost |
|---|---|---|---|
| **MSG91** | India-focused, OTP templates pre-approved, fast | DLT registration friction | ~₹0.15 / SMS |
| Twilio | Global, polished docs | More expensive in India, slow Indian routes | ~₹0.50 / SMS |
| Fast2SMS | Cheap | Less reliable, limited template control | ~₹0.10 / SMS |
| MessageBird / Plivo | Global | Similar to Twilio | mid-range |

**Recommendation: MSG91.** Plan:

- V1: keep the demo-OTP fallback for local dev (controlled by `SMS_PROVIDER=demo` env var)
- V2: flip `SMS_PROVIDER=msg91` and add real credentials
- Always: never include OTP in API response when `SMS_PROVIDER != "demo"`. Codify this in `services/otp.py`.

DLT (Distributed Ledger Technology — TRAI requirement) header/template registration takes ~2 weeks. Start that paperwork in parallel with the rewrite.

---

## 8. File storage — V1 keeps it simple

Current Node backend uses Multer with disk storage in `/uploads`. The Python rewrite mirrors this exactly:

- FastAPI's `UploadFile` accepts the same multipart form
- Saved to `backend-py/uploads/` (gitignored)
- Served via FastAPI's `StaticFiles` mount at `/uploads`
- Same 5 MB limit, same extensions (jpg/png/webp)
- Image filename pattern: `{timestamp}-{random}.{ext}` — identical to current

**V2 path: Cloudflare R2** (S3-compatible, free egress, ~$0.015/GB stored). Migration is one service swap behind a `services/storage.py` interface — design for it now, ship local disk first.

---

## 9. Migration plan — zero-downtime cutover

Five phases. Each phase is independent and reversible.

### Phase 0 — Setup (3 days)

- [ ] Spin up Supabase project; copy `DATABASE_URL`
- [ ] `backend-py/` scaffold (FastAPI, SQLAlchemy, Alembic, ruff, mypy, pytest)
- [ ] First Alembic migration creates `users` + `animals` tables
- [ ] Health check endpoint live; deploy to Railway as a parallel service (different port/subdomain)
- [ ] CORS configured for both `localhost:5173` (frontend dev) and `pashubazaar.netlify.app` (website)

**Exit gate**: `GET /api/health` returns 200 from the Python service.

### Phase 1 — Auth port (3 days)

- [ ] `POST /api/auth/send-otp` — same body, same response shape, including `demo_otp` in dev only
- [ ] `POST /api/auth/verify-otp` — same JWT shape (`{ id: ... }` payload, 30-day expiry)
- [ ] `PUT /api/auth/profile`
- [ ] Slowapi rate limit on send-otp matches Express limits (5 per 15 min per IP)
- [ ] Unit tests cover happy path + bad phone, bad OTP, expired OTP, no token, bad token

**Exit gate**: integration test logs in with phone OTP, gets JWT, hits a protected endpoint.

### Phase 2 — Animals port (4 days)

- [ ] All 5 animal routes (GET list, GET my, GET id, POST, DELETE)
- [ ] Multipart upload working with `images[]` + form fields
- [ ] Pagination output shape matches Node exactly: `{ animals, total, page, pages }`
- [ ] `_id` field aliased from UUID (so frontend doesn't break)
- [ ] Static `/uploads/*` serves images

**Exit gate**: hit Python backend from frontend (point `VITE_API_URL` at it locally) and the entire app works.

### Phase 3 — Data migration (1 day)

Standalone script (`scripts/migrate_from_mongo.py`):

1. Connect to existing MongoDB
2. For each User → insert into Postgres `users`, capture Mongo `_id` → Postgres `id` UUID mapping
3. For each Animal → insert into `animals` with the new `seller_id` from the mapping
4. Copy `/uploads/*` files from Node backend folder to Python backend folder
5. Verify counts match

Dry-run first (write to a separate `_dryrun` schema). Then commit. Reversible: keep Mongo running until cutover succeeds.

**Exit gate**: row counts in Postgres match document counts in Mongo. Sample 20 random records match field-for-field.

### Phase 4 — Cutover (1 day)

- [ ] Flip `VITE_API_URL` env var on Vercel / Render frontend to point at the Python backend
- [ ] Watch error rates for 24h
- [ ] Keep Node backend running but stop accepting writes (`read-only mode` — can do this with a middleware flag)
- [ ] At 48h with no issues, decommission Node backend
- [ ] Rename `backend/` → `backend-node-archive/` (keep for reference), `backend-py/` → `backend/`

**Exit gate**: 72 hours of green metrics; Node backend powered off.

### Phase 5 — New surface for the website (2 days)

Now that the Python backend is live and you control the codebase:

- [ ] Add `/api/public/*` endpoints (phone-stripped responses, rate-limited)
- [ ] Add `GET /api/public/stats` for website's trust strip
- [ ] Connect the marketing website (in `/website/app/`) to these endpoints

**Total**: ~14 working days end-to-end. Compress to 10 if you focus hard.

---

## 10. Timeline summary

| Phase | Days | Output |
|---|---|---|
| 0 — Setup | 3 | FastAPI + Postgres + Alembic skeleton deployed, health check live |
| 1 — Auth port | 3 | All auth endpoints live, JWT contract matches Node |
| 2 — Animals port | 4 | All animal CRUD + image upload working |
| 3 — Data migration | 1 | Mongo → Postgres script run successfully on prod data |
| 4 — Cutover | 1 | Frontend pointed at Python, Node retired |
| 5 — Public API | 2 | `/api/public/*` for the marketing website |
| **Total** | **14** | Full Python backend in production |

---

## 11. What's intentionally NOT in this rewrite

- ❌ Schema redesign / breaking changes to the frontend
- ❌ Real SMS delivery (separate track — DLT paperwork takes ~2 weeks)
- ❌ Cloudflare R2 / S3 (V2; ship local disk first like the Node backend)
- ❌ Redis (V2; OTP lives in the users table for now)
- ❌ Celery / background workers (no job today demands it)
- ❌ GraphQL / WebSockets
- ❌ Admin panel (separate tool when needed)
- ❌ AI/ML features (the *reason* to use Python — but those come later)

---

## 12. Decisions I made on your behalf — push back if wrong

1. **PostgreSQL over MongoDB.** You asked for the best DB. This is it. If you want MongoDB instead (familiarity, existing data), say so and I'll swap SQLAlchemy for Beanie/Motor; the rest of the plan barely changes.
2. **FastAPI over Django.** Django is heavier for an API-only service. If you want admin-panel and ORM out of the box, Django + DRF is the alternative.
3. **uv over poetry / pipenv.** Just because uv is faster and the future. If your team is already on poetry, use poetry.
4. **Railway over self-hosted VPS.** Managed Postgres + auto-deploy is worth $5–10/mo at this stage. Self-host when traffic/cost justifies it.
5. **MSG91 over Twilio.** India-specific. If you have an existing Twilio account or plan to expand internationally, use Twilio.

---

## 13. Ready check

When you say "go":

1. I create the `backend-py/` scaffold (pyproject.toml, FastAPI app, first Alembic migration, Docker Compose for local Postgres)
2. We get `GET /api/health` returning 200 against a real Postgres
3. Then phase 1 (auth port), and so on

Or if any decision in this doc feels wrong (especially the DB pick, or the rewrite-vs-refactor framing in Section 1), tell me before I start writing code.
