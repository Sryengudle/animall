# Frontend ↔ Node Backend Integration Plan

> Architect lens. Wire the redesigned React frontend to the existing
> Node/Express/Mongoose backend as the canonical API. The Python `/backend-py`
> stays on the shelf for now — revisit when AI/ML features land. OTP flow stays
> in **demo mode** for this round (real SMS deferred per the founder's call).

---

## TL;DR — the decisive picks

| Decision | Pick | Why |
|---|---|---|
| **Canonical API** | `/backend` (Node + Express + Mongoose) | Already works, frontend already wired to it shape-wise |
| **Python `/backend-py`** | Preserved but **inactive** | Don't delete — return to it for AI features later |
| **Schema changes** | **Additive only** (no breaking changes) | Existing data keeps working; new fields default to `''` / `0` / `false` |
| **OTP** | **Stay in demo mode** (`demo_otp` in response) | Per founder: real SMS deferred to a later round |
| **New endpoints to add** | `PUT /api/animals/:id` (edit listing) — that's the only **must-add** | Everything else is field extensions on existing endpoints |
| **Profile save (BROKEN today)** | Replace `updateUser` reducer with `updateProfile` thunk that calls `PUT /api/auth/profile` | Currently profile edits are localStorage-only — they vanish on logout |
| **Video uploads** | Extend Multer filter to accept video MIME types, bump size limit to 20 MB | Sell flow has video tiles; backend currently rejects them |
| **Port** | Stay on **5000**. **Disable macOS AirPlay receiver** (System Settings → General → AirDrop & Handoff → AirPlay Receiver: Off) | Cleanest. Fallback: run Node on `PORT=5002` and flip vite proxy |
| **Vite proxy** | Flip `/api` from `5001` (Python) → **`5000`** (Node) | One-line change in `frontend/vite.config.js` |

**Single biggest fix**: profile saves currently never reach the backend. Everything else is additive polish.

---

## 1. Today's wired state (the audit)

### What works end-to-end

| Frontend action | Frontend code | Backend endpoint | Status |
|---|---|---|---|
| Send OTP | `authSlice.sendOTP` | `POST /api/auth/send-otp` | ✓ wired |
| Verify OTP | `authSlice.verifyOTP` | `POST /api/auth/verify-otp` | ✓ wired |
| Browse listings | `animalsSlice.fetchAnimals` | `GET /api/animals?...` | ✓ wired — passes query params already |
| My listings | `animalsSlice.fetchMyListings` | `GET /api/animals/my/listings` | ✓ wired |
| View listing detail | reads `state.animals.list` | (cached from `fetchAnimals`) | ✓ via Redux store |
| Create listing | `animalsSlice.addAnimal` | `POST /api/animals` (multipart) | ✓ wired, but rejects video |
| Delete listing | `animalsSlice.deleteAnimal` | `DELETE /api/animals/:id` | ✓ wired |
| Logout | `authSlice.logout` (reducer) | — (client-only) | ✓ |
| Share listing | `navigator.share()` / clipboard | — (Web Share API) | ✓ |
| Language switch | `uiSlice.setLang` | — (client-only, localStorage) | ✓ |
| Theme toggle | `uiSlice.setTheme` | — (client-only) | ✓ |

### What's **broken** today

| Action | Why broken |
|---|---|
| **Edit profile** | `EditProfilePage` dispatches `updateUser` which is a **reducer**, not a thunk. It only mutates Redux state + localStorage. **The new name/location/photo/birthday/etc. never reach the backend.** Refresh in another browser → fields are gone. |

### What's not built yet (frontend or backend)

| Feature | Missing piece |
|---|---|
| Edit existing listing | No `PUT /api/animals/:id` endpoint, no frontend edit page |
| Profile photo upload | No backend endpoint to receive an avatar image |
| Negotiable toggle | No `isNegotiable` field on Animal model, no toggle UI on Sell form |
| Video in listing media | Multer rejects video MIME types |
| Server-side filtering for new facets (milkCapacity range, distance, lactation, listed-when) | Backend supports `type`, `minPrice`, `maxPrice` only. Currently the redesigned frontend filters **client-side after fetch**, which works at small scale but won't at 10k+ listings |

---

## 2. Decision matrix — what we change vs leave alone

### Change

1. **Vite proxy** — repoint to Node (`http://localhost:5000`)
2. **User model** — add 7 optional fields (additive)
3. **Animal model** — add 1 field (`isNegotiable`); optionally `videoUrl`
4. **Multer** — accept video MIME types, raise size cap to 20 MB
5. **`PUT /api/auth/profile`** — accept the 7 new fields in body
6. **`POST /api/animals`** — accept `isNegotiable` field in form body
7. **`PUT /api/animals/:id`** — NEW endpoint (owner can edit own listing)
8. **`POST /api/auth/profile-photo`** — NEW endpoint (multipart, single image)
9. **`authSlice`** — add `updateProfile` and `uploadProfilePhoto` thunks; deprecate the `updateUser` reducer for profile-page use (keep it for OTP-verify response only)
10. **`animalsSlice`** — add `updateAnimal` thunk
11. **`EditProfilePage`** — wire to `updateProfile` thunk
12. **`SellPage`** — add Negotiable toggle, accept video files through MediaUploadTile

### Leave alone

1. OTP flow (mock mode stays — `demo_otp` returned in dev)
2. All listing-browse logic (already works)
3. Filter UX (`PremiumFiltersSheet` keeps client-side filtering for V1 — fast at our data volume)
4. Theme + language (client-only)
5. Bottom nav, header chrome, all of the V2 redesign visuals
6. `/backend-py` Python service — kept as-is for future AI features

---

## 3. Backend changes — surgical, additive

### 3.1 User model additions

In `backend/models/User.js`, add to the schema:

```js
profilePhoto:    { type: String, default: '' },
whatsapp:        { type: String, default: '', match: /^[6-9]\d{9}$|^$/ },
dob:             { type: Date,   default: null },
occupation:      { type: String, default: '' },   // HOME | FARMING | DAIRY | TRADING | OTHER
education:       { type: String, default: '' },   // NONE | UPTO_5 | UPTO_8 | UPTO_10 | UPTO_12 | GRADUATE | OTHER
experience:      { type: String, default: '' },   // 0-1 | 1-3 | 3-5 | 5-10 | 10-20 | 20+
livestock:       { type: Number, default: 0, min: 0 },   // cattle count
```

Backwards-compatible: existing users get default values on next read. No migration script needed.

### 3.2 Animal model additions

```js
isNegotiable:    { type: Boolean, default: true },   // sell-time toggle, default ON
videoUrl:        { type: String,  default: '' },     // optional single video
```

Skip `udderPhotoUrl` / `milkingVideoUrl` as separate fields for V1 — they live in `images[]` array (frontend orders them).

### 3.3 Multer file filter

Currently rejects everything except `jpeg/jpg/png/webp`. Extend in `backend/middleware/upload.js`:

```js
const allowedImages = /jpeg|jpg|png|webp/;
const allowedVideos = /mp4|mov|webm|quicktime/;
const isImage = allowedImages.test(path.extname(file.originalname).toLowerCase())
             && allowedImages.test(file.mimetype);
const isVideo = allowedVideos.test(path.extname(file.originalname).toLowerCase())
             && /^video\//.test(file.mimetype);
isImage || isVideo ? cb(null, true) : cb(new Error('Only images (jpg/png/webp) or videos (mp4/mov/webm)'));
```

Bump limit:
```js
limits: { fileSize: 20 * 1024 * 1024 } // 20 MB to accommodate video
```

### 3.4 `PUT /api/auth/profile` — extend body

Currently accepts `{ name, location }`. Extend to accept all new fields:

```js
router.put('/profile', protect, async (req, res) => {
  const ALLOWED = ['name', 'location', 'profilePhoto', 'whatsapp',
                   'dob', 'occupation', 'education', 'experience', 'livestock'];
  const update = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => ALLOWED.includes(k))
  );
  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true })
                          .select('-otp -otpExpiry');
  res.json(user);
});
```

The `ALLOWED` whitelist guards against mass-assignment.

### 3.5 `POST /api/auth/profile-photo` — NEW

```js
router.post('/profile-photo', protect, upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  const url = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(req.user._id, { profilePhoto: url }, { new: true })
                          .select('-otp -otpExpiry');
  res.json({ url, user });
});
```

### 3.6 `POST /api/animals` — accept `isNegotiable`

In `backend/routes/animals.js`, when creating an animal:
```js
const { ..., isNegotiable } = req.body;
const animal = await Animal.create({
  ...,
  isNegotiable: isNegotiable === 'false' ? false : true,   // form field is string
});
```

### 3.7 `PUT /api/animals/:id` — NEW endpoint (edit listing)

```js
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  if (!animal) return res.status(404).json({ message: 'Not found' });
  if (animal.sellerId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  const ALLOWED = ['type', 'price', 'age', 'ageUnit', 'location',
                   'breed', 'calving', 'milkPerDay', 'description', 'isNegotiable'];
  ALLOWED.forEach((k) => { if (k in req.body) animal[k] = req.body[k]; });

  // If new images uploaded, append (or replace — decide via `?mode=replace`)
  if (req.files?.length) {
    const newUrls = req.files.map((f) => `/uploads/${f.filename}`);
    animal.images = req.query.mode === 'replace' ? newUrls : [...animal.images, ...newUrls];
  }

  await animal.save();
  res.json(animal);
});
```

---

## 4. Frontend changes — wire to backend

### 4.1 Vite proxy flip

In `frontend/vite.config.js`:

```js
server: {
  proxy: {
    '/api':     'http://localhost:5000',   // back to Node
    '/uploads': 'http://localhost:5000',
  },
}
```

### 4.2 Redux thunks to add

In `frontend/src/store/slices/authSlice.js`:

```js
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (patch, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await api.put('/auth/profile', patch, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;          // updated user
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update');
    }
  },
);

export const uploadProfilePhoto = createAsyncThunk(
  'auth/uploadProfilePhoto',
  async (file, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const fd = new FormData();
      fd.append('photo', file);
      const res = await api.post('/auth/profile-photo', fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Upload failed');
    }
  },
);
```

Wire fulfilled cases to update `state.user`.

In `frontend/src/store/slices/animalsSlice.js`:

```js
export const updateAnimal = createAsyncThunk(
  'animals/update',
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/animals/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  },
);
```

### 4.3 `EditProfilePage` — replace local-only save

Change in `handleSubmit`:

```diff
- dispatch(updateUser({ name: form.name, location: form.location, ... }));
+ try {
+   await dispatch(updateProfile({
+     name: form.name,
+     location: form.location,
+     whatsapp: form.whatsapp,
+     dob: form.dob,
+     occupation: form.occupation,
+     education: form.education,
+     experience: form.experience,
+     livestock: Number(form.livestock) || 0,
+   })).unwrap();
+   if (photoFile) await dispatch(uploadProfilePhoto(photoFile)).unwrap();
+   toast.success(tr('done'));
+   navigate('/profile');
+ } catch (err) {
+   toast.error(err || tr('error_generic'));
+ }
```

The local `updateUser` reducer stays for the OTP-verify flow (which sets the user on login). It just isn't called for profile edits anymore.

### 4.4 `SellPage` — Negotiable toggle + video acceptance

Add a Negotiable toggle (sell-time, default ON) to the form, send `isNegotiable` in formData.

Change MediaUploadTile usage from `kind="photo"` to `kind="video"` for the milking-video tile. The backend now accepts video files.

### 4.5 Edit listing flow (new)

Two options for entry point — pick one:

| Option | Pros | Cons |
|---|---|---|
| **A. New `/edit-listing/:id` route** with its own page | Clean separation | More code |
| **B. `/sell?edit=<id>` — Sell page detects edit mode and pre-fills** | Reuses SellPage code | Mixing intents in one page |

Recommend **A**. Use the same form layout as SellPage (extract into a shared `<AnimalForm>` component if we want).

For V1 of integration, defer this — most users won't edit, they'll delete + relist. Add it in a follow-up.

### 4.6 Backend filter params (optional, V2 of integration)

`PremiumFiltersSheet` filters client-side currently. Fine at small data. When listings exceed ~500, extend `GET /api/animals` to accept:

```
?type=cow&milkMin=8&milkMax=12&priceMin=20000&priceMax=80000&distanceMax=50&lactation=2&sort=newest
```

And teach the route to compose Mongo queries. Not needed for V1 integration.

---

## 5. Environment + dev workflow

### 5.1 Backend `.env` (new — currently missing)

Create `/backend/.env`:

```sh
MONGO_URI=mongodb://localhost:27017/animall
# Or for Mongo Atlas:
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/animall

JWT_SECRET=<32+ char random string>
CLIENT_URL=http://localhost:5174
PORT=5000
```

### 5.2 macOS AirPlay port 5000 conflict

Two options — pick one:

**Option A: Disable AirPlay receiver (recommended)**
> System Settings → General → AirDrop & Handoff → AirPlay Receiver: **Off**

Then Node runs on `5000` as designed. The vite proxy goes to `http://localhost:5000`.

**Option B: Move Node to 5002**

Set `PORT=5002` in `.env`. Update `vite.config.js`:
```js
'/api': 'http://localhost:5002',
'/uploads': 'http://localhost:5002',
```

### 5.3 MongoDB prerequisite

Backend needs a Mongo instance reachable at `MONGO_URI`. Options:
- **Local**: `brew install mongodb-community && brew services start mongodb-community` → default `mongodb://localhost:27017`
- **Atlas (cloud, free tier)**: sign up → copy connection string into `MONGO_URI`
- **Docker**: `docker run -p 27017:27017 -d mongo:7`

Pre-flight: `mongosh mongodb://localhost:27017` should connect.

### 5.4 Start commands (daily)

Terminal 1 — Node backend:
```sh
cd backend
npm install       # first time
npm run dev       # nodemon on PORT (default 5000)
```

Terminal 2 — Frontend:
```sh
cd frontend
npm run dev       # vite on 5174 (or auto-bump)
```

---

## 6. Migration — what to do with existing data

There IS no production data yet. So:

- New User schema fields appear as defaults on next read — Mongoose handles it
- Existing animals get `isNegotiable: true` by default — Mongoose handles it
- No migration script needed

If we move to production later, this same pattern (additive only) means a hot deploy with zero data fixes.

---

## 7. Phasing — 5 working days

| Day | Workstream | Output | Acceptance |
|---|---|---|---|
| **1** | Backend wire-up | `.env` set, MongoDB reachable, Node on 5000 (or 5002), vite proxy flipped, existing OTP + browse-animals smoke test passes via curl | `GET /api/animals` returns `{ animals, total, page, pages }` from Node, frontend `/buy` shows real listings (or empty + demo fallback) |
| **2** | User schema + profile save fix | User model extended with 7 fields, `PUT /api/auth/profile` accepts them, `updateProfile` thunk added, `EditProfilePage` wired to thunk, photo upload endpoint live | Save edits in browser → log out → log in from another browser → fields persist |
| **3** | Animal — Negotiable + Edit listing | `isNegotiable` field, `PUT /api/animals/:id`, `updateAnimal` thunk, edit-listing UI (optional V1) | Toggle negotiable in Sell form → reflects on detail page |
| **4** | Video uploads + 3-tile sell | Multer accepts video MIME types + 20 MB cap, MediaUploadTile kind flipped to `video` for milking tile, sell flow with 1 photo + 1 udder photo + 1 milking video posts successfully | `POST /api/animals` with mixed image+video files returns 201 with URLs |
| **5** | QA + polish | Manual walk-through every page in all 3 languages, test profile edit, listing create, listing edit, listing delete, sharing, language switch, theme switch | No console errors; all features round-trip to backend |

Compress to 3 days if Day 5 polish is light (Days 4 and 5 can merge).

---

## 8. Non-breaking guarantee

Everything in this plan is **additive**:

- Old endpoints keep their existing request/response shapes
- New endpoints (`PUT /:id`, `POST /profile-photo`) are net-new — no conflict
- New schema fields default to falsy — old records read fine
- Frontend code paths that don't use the new fields keep working
- The `updateUser` reducer is **kept** (used by OTP-verify) — only its usage in `EditProfilePage` is replaced

Rollback is one git revert away.

---

## 9. What's intentionally NOT in this plan

- ❌ Real SMS for OTP (MSG91 / Twilio integration) — deferred per your call
- ❌ Migration of any data from MongoDB to Postgres — Python backend stays shelved
- ❌ Server-side filtering for the 7 PremiumFilter facets (client-side filtering handles current volume)
- ❌ Server-side rendering / SEO — handled by the separate website project
- ❌ Background jobs / webhooks
- ❌ Image / video transcoding, thumbnails, CDN — files stored as-uploaded in `/uploads`
- ❌ Rate limiting beyond the existing OTP endpoint
- ❌ Admin / moderation tools
- ❌ Push notifications

---

## 10. Open decisions — confirm before kicking off

1. **AirPlay vs port 5002** — disable AirPlay (cleaner) or run Node on 5002?
2. **MongoDB host** — local install, Atlas, or Docker?
3. **Edit-listing entry point** — `/edit-listing/:id` page (option A) or `/sell?edit=<id>` reuse (option B)? Or defer entirely?
4. **Profile photo size limit** — same 5 MB as listing photos, or smaller?
5. **Filter granularity for V1** — keep client-side filtering, or do backend filter params now?

Default answers (if you don't override): disable AirPlay → local MongoDB → defer edit-listing → 5 MB profile photos → client-side filters for V1.

---

## 11. Ready check

When you say "go":

1. I update Vite proxy and create `.env` template
2. Verify Node backend boots against MongoDB
3. Extend User + Animal schemas (additive)
4. Add `PUT /animals/:id`, `POST /auth/profile-photo`, extend `PUT /auth/profile`
5. Extend Multer for video
6. Add `updateProfile`, `uploadProfilePhoto`, `updateAnimal` thunks
7. Replace `dispatch(updateUser(...))` with `dispatch(updateProfile(...))` in `EditProfilePage`
8. Add Negotiable toggle in `SellPage`
9. End-to-end smoke test all routes

Or push back on any of the open decisions before I start.
