# Frontend Redesign Plan

> Senior UI/UX lens. Borrow the **layout, patterns, and field-set** from the Pashu Mandi reference screens. Keep **our existing emerald + warm amber brand** unchanged. No backend changes required for V1 of the redesign.

---

## TL;DR — the decisive picks

| Decision | Pick | Why |
|---|---|---|
| Color theme | **Keep emerald `#047857` + warm amber `#D97706`** | User explicitly asked. Maintains brand continuity with the marketing site and the Python backend's identity. |
| Typography | **Noto Sans + Noto Sans Devanagari** (unchanged) | Already loaded; works for all 3 scripts. |
| Layout density | **Card-first, generous spacing, large touch targets** | Matches reference. Rural users on mid-range phones — finger-friendly. |
| Sell flow | **Single scrollable page with chip selectors** (replaces current 5-step wizard) | Reference uses one page; faster posting; fewer abandonment points. |
| Filters | **"Premium Filters" bottom sheet** with grouped filter cards | Reference's killer pattern — no typing required. Massive UX win for low-literacy users. |
| Bottom nav | **3 tabs: Buy · Sell · My Cattle** | Matches reference; current app has more tabs to consolidate. |
| Language picker | **2×2 modal with landmark imagery** | Visual, memorable, works for non-readers. |
| Profile completion | **% badge + multi-section edit form** | Drives data quality; new fields (birthday, occupation, education, cattle count, experience). |
| Listing card | **Rich card with stats grid + inline Call/WhatsApp** | Reduces taps to contact seller; the whole point of the marketplace. |

**Scope**: ~10 working days to redesign the entire mobile app. Backend stays; we add ~6 optional new fields (additive, non-breaking).

---

## 1. Reference inventory — what we're borrowing from the screenshots

| Screen | Pattern we adopt |
|---|---|
| 1 — Sell form (top) | Chip selectors for Animal/Breed/Lactation; mini icons next to section labels; sticky "Post" CTA |
| 2 — Sell form (middle) | Numeric input with unit chip suffix (Liters / Rupees); dashed-border media tiles |
| 3 — Home with location modal | Top "Select Location" card; category tiles with photos; quick filter row |
| 4 — Premium Filters (Milk) | Bottom sheet, grouped filter cards, icon-circle + title + subtitle, pill grid |
| 5 — Premium Filters (Choose Animal) | Same shell, different filter card |
| 6 — Language modal | 2×2 grid with landmark imagery on dark scrim |
| 7 — Profile + Logout | Card-based settings; "X% Incomplete" amber badge |
| 8 — Listing card | Time-ago / price / negotiable header, location with distance, 2-stat grid, seller block with Call+WhatsApp |
| 9 — Sell form (bottom) | Expandable "Add more information" accordion; Location field with Change link |
| 10 — Home (full) | Position of FAB "Sell Livestock"; "ALL ANIMALS SHOWING" + count band; video-preview card |
| 11 — Edit profile (Hindi) | Two-column WhatsApp + Phone; birthday/occupation/education/cattle count/experience dropdowns |
| 12 — Filters: When listed | Vertical-stack filter card (Anytime / 1H / 1D / 2D); one-card-per-screen style |
| 13 — Filters: Price | Pill grid for currency ranges |
| 14 — Edit profile (top) | Avatar with camera badge; "Photo डालें" CTA; one-time address change warning |
| 15 — Filters: Sort & toggles | Sort pills (Most Recent / Low Price / Nearest / Farthest) + boolean toggles below |
| 16 — Filters: Lactation | Pill grid with stage labels |
| 17 — Empty My Cattle | Card-wrapped empty state with action |
| 18 — Profile main (Eng) | Header with En/हिं language toggle pill; user card; settings list; legal footer |

---

## 2. Design tokens (extending the existing system)

We keep every token from `frontend/src/index.css` and `tailwind.config.js`. We **add** these patterns:

### New CSS variable additions (none needed — reuse existing)
Already in the system: `--color-primary-*`, `--color-accent-*`, `--color-brand-*`, `--color-surface-*`, shadows (`card`, `button`, `glass`), animations.

### New Tailwind utility classes (compose, don't extend)
- **Chip surface**: `bg-white border border-border rounded-full px-4 py-2.5 text-sm font-medium text-ink min-h-[44px]`
- **Chip selected**: `bg-brand-50 border-brand-300 text-brand-800 ring-1 ring-brand-200`
- **Chip pill (filter)**: rounded-2xl, two-line label (title + subtitle), 2-col grid
- **Filter card**: white card, icon-circle 48×48 in `bg-brand-50`, title + body, 16px padding

### Density rules (mobile-first)
- Minimum touch target: 48×48 px
- Section gap: 24–32 px between major sections
- Card internal padding: 16–20 px
- Body font scale: 14–16 px (don't go smaller; rural users include older eyes)

---

## 3. Page-by-page redesign

### 3.1 Header (`Header.jsx`)
**Before**: Simple top bar.
**After**:
- Background: solid `bg-brand-700` (deep emerald — same role as the maroon in reference).
- Left: 🐄 + "Pashubazaar" in white + tagline "गाय-भैंस खरीदो-बेचो" in 11px white/70.
- Right: "Sell Livestock" pill CTA (visible on width ≥ 360 px, ghost on smaller) + avatar that opens Profile.
- Height: 64 px. No bottom border; subtle shadow only on scroll.

### 3.2 Bottom navigation (`BottomNav.jsx`)
**After**: **3 tabs only**: Buy · Sell · My Cattle.
- Icons: `🔍+` magnifier (Buy), cow silhouette (Sell — distinctive), receipt-list icon (My Cattle).
- Active: emerald-700 icon + label; inactive: muted gray.
- Center tab (Sell) gets a slightly larger icon as a visual anchor.

### 3.3 Home / Buy page (`HomePage.jsx` + `BuyPage.jsx` → merge into one)
Currently two separate pages — the reference treats them as one. Merge:

1. **Location card** (top): pin icon + "Select Location" + "Change" pill. Opens `LocationSheet`.
2. **Category row** (3 tiles): Cow / Buffalo / Other Animals. Each tile = 1:1 aspect with image overlay + label bottom-left. Tap = filter list by category.
3. **Quick filter row** (3 cards): Milk · Price · Distance & Nearby. Each card shows current selection ("All Capacity", "All Budget", "Nearby"). Tap = open `PremiumFiltersSheet` scrolled to that section.
4. **Result band**: "ALL ANIMALS SHOWING" left, "19 ANIMALS" right.
5. **Listing list**: stacked `ListingCard`s.
6. **Sticky FAB** "Sell Livestock" (emerald, pill shape, right edge, anchored above bottom nav).

### 3.4 Listing card (`AnimalCard.jsx` → `ListingCard.jsx`)
The most-seen UI in the app. Rebuild:

```
┌──────────────────────────────────────────┐
│ (video preview with ▶ overlay if exists) │
│                              [🚩] [🔗]   │
├──────────────────────────────────────────┤
│ 15 MINUTES AGO              ₹35,000      │
│ HOLSTEIN FRIESIAN Cow      Negotiable    │
│ 📍 Idrishpur (approx. 110 km)            │
│ ┌────────────┐ ┌────────────┐            │
│ │ Lactation  │ │ Milk Cap.  │            │
│ │ 1 Lactation│ │ 10 L/day   │            │
│ └────────────┘ └────────────┘            │
│ ────────────────────                     │
│ ⓓ Deepak           [📞 Call Now] [WhatsApp] │
│   Livestock Owner                        │
└──────────────────────────────────────────┘
```

- Video preview: 16:9, rounded-2xl, play overlay
- Flag + Share icons: circular, semi-transparent dark background
- Time-ago: uppercase 11px muted
- Price: bold emerald-800; "Negotiable" small label below if `is_negotiable`
- Distance: from user's selected location → use Haversine; backend doesn't have to know
- Stat tiles: light brand-50 background, two cells
- Seller block: 32px avatar + name (semibold) + "Livestock Owner" (xs brand-700)
- **Call Now** button: blue-500 bg (reference uses literal blue — overrides our palette here intentionally because it's universal for "phone")
- **WhatsApp** button: WhatsApp-green `#25D366` (also literal, the brand convention)

### 3.5 Sell Livestock form (`SellPage.jsx`)
**Before**: 5-step wizard with progress bar.
**After**: **Single scrollable page**, sections delimited by mini-icon + label, sticky "Post" CTA at bottom.

Sections in order:
1. **FREE to list your animal** info banner (white card, ℹ icon, brand-700 "FREE")
2. **Which animal?** — chips: Cow / Buffalo / Bull (one-select, required)
3. **Breed** — chips: dynamic by animal type (Cow: Holstein/Jersey/Sahiwal/Gir/Desi/Other dropdown — Bull: Haryanvi/Desi/Gujrati/Other — etc.)
4. **Which lactation?** — chips: Not delivered / First / Second / Other (cows + buffalo only; hide for Bull/Other Animals)
5. **Current milk (per day)** — numeric input + "Liters" suffix chip. Helper: "Total milk from 2 times today"
6. **Price (₹)** — numeric input prefix `₹` + "Rupees" suffix chip. Helper: "Enter correct price - animal will sell faster"
7. **Add video or photo** — three dashed-border tiles in a grid:
   - Select video (general)
   - Select udder photo
   - Add milking video (full-width)
   Each tile has an icon, label, and emerald-outline "Select video/photo" button.
8. **Add more information** — collapsible accordion. Inside: description textarea, calving date, deworming history, etc.
9. **Location** — read-only input + "Change" link (opens `LocationSheet`). Helper: "Buyers will see your animal at this location"
10. **Sticky bottom**: full-width "Post" button. Disabled until required fields are filled (visually muted brand-200 like in reference).

### 3.6 Premium Filters sheet (NEW — `PremiumFiltersSheet.jsx`)
The crown jewel of the reference UX. Bottom sheet with grouped filter cards.

- Header: "Premium Filters" + subtitle "Choose right animals quickly without typing"
- Status chip: "All animals showing" (or active filter count)
- Body: scrollable, vertically stacked **filter cards** (one per facet):
  1. **Choose Animal** — All / Cow / Buffalo / Other Animals
  2. **Milk Capacity** — All / 0–5 / 5–8 / 8–10 / 10–12 / 12–15 / 15–20 / 20+ L
  3. **Price** — All Budget / ₹0–20K / ₹20–50K / ₹50–80K / ₹80–99K / ₹1–1.5L / ₹1.5L+
  4. **Distance & Location** — Nearby Only / 25 km / 50 km / 100 km / 200 km / Any
  5. **Lactation Stage** — All / Not Delivered / 1st / 2nd / 3rd / 4th+
  6. **When Animal Listed** — Anytime / 1 Hour Ago / 1 Day Ago / 2 Days Ago
  7. **Sort & Additional Options** — Most Recent / Low Price / Nearest / Farthest sort pills + "Nearby Only" toggle + "Negotiable Only" toggle
- Each filter card: icon-circle 48×48 in brand-50 + title + 1-line subtitle + 2-col pill grid
- Footer bar (sticky): 🛡 "No additional filters" status + "Reset" outline button + "Apply" filled emerald button

### 3.7 Location sheet (NEW — `LocationSheet.jsx`)
- Header: × close (left) · "Use current location" (right, green chip with crosshair icon)
- "Search by address" — large text input with pin icon
- "or" divider (light, centered)
- "Search address by pincode" — 6-digit input styled like an OTP (6 underline cells) + decorative pillar-box illustration

### 3.8 Language sheet (`LanguageSwitcher.jsx` → bottom sheet variant)
- Header: "Choose Language" + subtitle "Select your preferred language"
- 2×2 grid of language cards (16:9 each):
  - हिंदी / Hindi — Lotus Temple background
  - English — Tower Bridge or generic landscape
  - मराठी / Marathi — Gateway of India
  - (Gujarati optional — see open decisions)
- Selected card: 3 px emerald border + glow
- Tap a card → set language + close sheet

### 3.9 Profile main (`ProfilePage.jsx`)
- Header: back arrow · "User" · En|हिं|मर language pill (right)
- User card: avatar + name + "India | <phone>" + "10% Incomplete" amber badge + "Edit" pill (top right)
- Settings list cards (full width):
  - Share with Friends → opens native share
  - Logout (red icon)
- Footer: version "2.0.4 (92)" · Privacy · Terms · Refund · © 2026 Pashubazaar

### 3.10 Edit profile (`EditProfilePage.jsx`)
Major expansion of fields. All optional, drives the completion %.

| Field | Type | Required | Notes |
|---|---|---|---|
| Profile photo | image | no | Camera badge on avatar |
| Name | text | yes (for marketplace trust) | |
| Language | select | yes | Opens `LanguageSheet` |
| Address | text + location pin | yes | One-time change warning |
| WhatsApp number | tel | no | Defaults to phone if not set |
| Phone | tel | (read-only) | Already verified via OTP |
| Birthday | date | no | |
| Occupation (काम) | select | no | Farmer / Trader / Vet / Other |
| Education (पढ़ाई) | select | no | <10 / 10 / 12 / Graduate / Postgrad |
| Cattle count | number | no | |
| Experience years (पशुपालन का अनुभव) | select | no | <1 / 1–3 / 3–5 / 5–10 / 10+ |
| **Submit** | button | | Full-width emerald |

### 3.11 My Cattle (`MyListingsPage.jsx`)
- **Empty state** (when user has no listings): card with "No animals listed yet" + sub + "Sell Livestock" pill button (emerald)
- **Populated**: header band "ALL ANIMALS SHOWING" + count + stacked `ListingCard`s. Each card can be tapped to view/edit/delete.

### 3.12 Listing Detail (`ListingDetailPage.jsx`)
Like a single expanded `ListingCard`:
- Full photo/video carousel (swipe)
- Title + price + negotiable badge
- Location + map snippet (optional, V2)
- Stats grid (Lactation, Milk Capacity, Age, Breed, Calving date)
- Description
- Seller card with Call + WhatsApp
- "Report listing" link at bottom

---

## 4. New components to build

| Component | Maps to existing? | Purpose |
|---|---|---|
| `ChipSelect` | ✓ extend `Chip.jsx` | Multi/single-option pill row |
| `FilterCard` | NEW | Premium filter group container |
| `FilterPill` | ✓ extend `Chip.jsx` | Two-line pill (title + subtitle) used inside filter cards |
| `QuickFilterTile` | NEW | Compact filter card on Home (Milk/Price/Distance) |
| `CategoryTile` | NEW | Cow/Buffalo image card |
| `ListingCard` | replace `AnimalCard.jsx` | Rich animal card with seller actions |
| `PremiumFiltersSheet` | ✓ uses existing `BottomSheet.jsx` | The filters modal |
| `LocationSheet` | ✓ uses `BottomSheet.jsx` | Address + pincode picker |
| `LanguageSheet` | replace `LanguageSwitcher.jsx` for modal use | Landmark grid |
| `MediaUploadTile` | NEW | Dashed-border media upload box |
| `OtpInput` | NEW (also used for pincode) | 6-digit underline input |
| `StickyFAB` | NEW | Floating "Sell Livestock" button |
| `CompletionBadge` | NEW | "10% Incomplete" amber pill |
| `SegmentToggle` | NEW | En|हिं|मर pill segmented control |
| `StatTile` | NEW | Lactation / Milk Capacity 2-cell |
| `CallActionRow` | NEW | Avatar + name + Call + WhatsApp |

We reuse: `BottomSheet`, `Avatar`, `Badge`, `Button`, `Card`, `Input`, `Select`, `Skeleton`, `IconButton`, `ImageWithFallback`, `EmptyState`, `Modal`.

---

## 5. Implementation phasing (10 working days)

| Day | Workstream | Output |
|---|---|---|
| 1 | Foundation primitives | `ChipSelect`, `FilterPill`, `OtpInput`, `SegmentToggle`, `StatTile`, `CompletionBadge`, `StickyFAB` + Storybook-style demo page |
| 2 | Chrome (Header + BottomNav + brand swap) | New emerald header, 3-tab bottom nav, route renames if needed |
| 3 | Listing card + Home page | `ListingCard` + Home/Buy merged page with location/category/quick-filter |
| 4 | Premium Filters sheet | `FilterCard`, `PremiumFiltersSheet` with all 7 facets, filter state in Redux |
| 5 | Sell Livestock form (Part 1) | Single-page form with chip selectors for animal/breed/lactation; numeric inputs with unit chips |
| 6 | Sell Livestock form (Part 2) | `MediaUploadTile` × 3, accordion for "Add more information", sticky Post bar, backend wire-up |
| 7 | Location & Language sheets | `LocationSheet` (address + pincode + current location), `LanguageSheet` 2×2 grid |
| 8 | Profile + Edit Profile | New profile view card, full edit form with 11 fields, completion % logic |
| 9 | Listing Detail + My Cattle | Detail page with carousel, My Cattle empty state + populated state |
| 10 | i18n, mobile QA, polish | New translation keys in mr/hi/en, dark mode pass, accessibility audit, micro-animations |

Realistic with one focused engineer. Compress to 7 days if we drop V2-only features (map, programmatic breed inference).

---

## 6. Backend implications (additive — no breaking changes)

We can ship the redesign with the current schema, but a few new fields would unlock the full reference UX:

| Field | Table | Type | Why |
|---|---|---|---|
| `is_negotiable` | animals | bool | "Negotiable Only" label + filter |
| `video_url` | animals | string | Video preview with play button |
| `udder_photo_url` | animals | string | Reference's "Select udder photo" |
| `milking_video_url` | animals | string | Reference's "Add milking video" |
| `whatsapp` | users | string(10) | Separate from phone |
| `birthday` | users | date | Profile field |
| `occupation` | users | enum | Profile field |
| `education` | users | enum | Profile field |
| `cattle_count` | users | int | Profile field |
| `experience_years` | users | int | Profile field |
| `profile_photo_url` | users | string | Avatar upload |

These are additive. Add via one Alembic migration; existing data unaffected. I can ship the frontend redesign in parallel — the missing fields just won't render until backend catches up.

---

## 7. i18n keys to add

The reference shows lots of new strings. New top-level groups needed in `frontend/src/i18n/{mr,hi,en}.js`:

```
sell.*                  — form sections, helpers, placeholders
filters.*               — premium filter labels, ranges
listingCard.*           — Negotiable Only, Livestock Owner, Call Now, etc.
location.*              — Use current location, Search by pincode
profile.*               — Photo डालें, Address, WhatsApp, Birthday, etc.
home.categories.*       — Cow, Buffalo, Other Animals
nav.*                   — Buy, Sell, My Cattle
empty.*                 — No animals listed yet
```

Translator notes:
- Currency labels (₹, Lakh, Thousand) — keep numerals as Devanagari for mr/hi, Latin for en
- "Liters" → लीटर (mr), लीटर (hi)
- "Rupees" → रुपये (mr/hi)
- "Lactation" → व्यान (mr) / ब्यांत (hi)

---

## 8. What this redesign does NOT change

- **Backend API contract** — frontend continues talking to the FastAPI we just built; same endpoints
- **Authentication flow** — OTP login unchanged
- **Routing** — same URL structure
- **Tech stack** — Vite + React + Tailwind + Redux
- **Color palette** — emerald + amber preserved
- **Fonts** — Noto Sans + Devanagari preserved

What this **does** change:
- Page layouts (every page)
- Component vocabulary (new patterns, replaces some old)
- Sell flow (5-step → 1 page)
- Filter UX (replaced with Premium Filters sheet)
- Profile (much richer)
- Listing card (much richer)

---

## 9. Open decisions — confirm before kicking off

1. ~~Add Gujarati (`gu`) as a 4th language?~~ **CONFIRMED 2026-05-13: stay with mr / hi / en only.** Language sheet shows 3 cards in a 2×1 + 1 layout (or 3-up row on wider screens) — landmark imagery: Gateway of India / Marathi · Lotus Temple / Hindi · Tower Bridge or generic / English.

2. ~~Sell flow: 5-step wizard or 1 page?~~ **CONFIRMED 2026-05-13: 1-page scrollable form.** Old 5-step `SellPage.jsx` will be archived (not deleted) as `SellPage.legacy.jsx`.

3. ~~Bottom nav tabs?~~ **CONFIRMED 2026-05-13: 3 tabs — Buy / Sell / My Cattle.** Profile moves to the avatar tap-target in the Header. Home route `/` redirects to `/buy`.

4. ~~Rebrand the React app to "Pashubazaar"?~~ **CONFIRMED 2026-05-13: yes for visible text.** `localStorage` keys (`animall_auth`, `animall_lang`) stay unchanged to avoid logging out existing users.

5. ~~"Negotiable Only" — sell-time toggle?~~ **CONFIRMED 2026-05-13: sell-time toggle, default ON.** Stored on the listing as `is_negotiable`.

6. ~~Profile completion % formula?~~ **CONFIRMED 2026-05-13: 10% per filled field.** Counted fields (10 total): phone (auto-100% from OTP), name, photo, address, WhatsApp, birthday, occupation, education, cattle_count, experience_years.

7. ~~Brand text in the header?~~ **CONFIRMED 2026-05-13: "Pashubazaar" Latin wordmark + "गाय-भैंस खरीदो-बेचो" Devanagari tagline.** Same pattern as marketing site.

8. ~~Media uploads location?~~ **CONFIRMED 2026-05-13: local disk in V1.** 20 MB max per video. R2 migration in V2.

---

## 10. Ready check

When you say "go":

1. I create a `frontend/src/components/v2/` folder for new components (avoids breaking the live app)
2. Build the foundation primitives + a `/preview` route that shows them
3. Land changes one page at a time so you can review each phase
4. Final cut-over flips the routes from old to new pages

Or push back on any decision above (especially #1, #3, #8). If a decision feels wrong, easier to flip now than after we've built around it.
