# 02 — Product

> **Lens**: Product manager. The shape of the site, the pages, the user flows.

---

## 1. Sitemap

```
/                              Home
/buy                           Public browse (filter, search, paginated)
/buy/[type]                    SEO landing: e.g. /buy/buffalo
/buy/[type]/[city]             SEO landing: e.g. /buy/buffalo/pune
/buy/[id]                      Listing detail (public, read-only)
/sell                          How selling works (CTA: download app)
/how-it-works                  Buyer + seller walkthroughs
/about                         Mission, founders, story, traction
/blog                          Blog index
/blog/[slug]                   Blog post
/partners                      For vets, feed brands, financiers, co-ops
/download                      App download (Play Store, App Store, QR, PWA)
/contact                       Support, business inquiries
/faq                           Common questions
/careers                       Job openings (Phase 4)
/press                         Media kit, logo, press mentions (Phase 4)
/legal/privacy                 Privacy policy
/legal/terms                   Terms of service
/legal/refund                  Refund / dispute policy
/[lang]/*                      Localized variants — mr (default), hi, en
```

Localization is route-prefixed: `/mr/buy/buffalo/pune`, `/en/buy/buffalo/pune`. Marathi is the default; the root `/` redirects to `/mr`.

## 2. Page-by-page specs

### Home (`/`)

**Goal**: in 5 seconds, the visitor knows what Animall is, who it's for, and what to do next.

Sections, top to bottom:

1. **Hero** — Marathi headline (with EN/HI toggle), one-line subhead, primary CTA "Download App" + secondary "Browse Listings". Background: farmer-with-cows illustration (spec already in `frontend/IMAGE_ASSETS_GUIDE.md`).
2. **Trust strip** — "X verified sellers • Y listings • Z districts" — live numbers from `/api/public/stats`. Conservative real numbers only; do not inflate.
3. **How it works** — 3 steps for buyers, 3 steps for sellers (tabbed).
4. **Featured listings** — 8 cards, live from API, each linking to public listing detail.
5. **Categories grid** — Cow, Buffalo, Goat, Sheep, Chicken, Pig — each linking to `/buy/[type]`.
6. **Testimonials** — Real farmer quotes only. If none yet, omit the section (do not fabricate).
7. **Blog teaser** — 3 latest posts.
8. **B2B band** — "Are you a vet / feed brand / financier? Partner with us." → `/partners`.
9. **Footer** — Sitemap, language switcher, social, legal links, app badges, contact.

### Public listings (`/buy`, `/buy/[type]`, `/buy/[type]/[city]`)

- Server-rendered (SSG with ISR), fully indexable.
- Filters: type, price range, age, location, breed.
- Card: photo, type badge, breed, age, price, district, seller first name only.
- **No phone numbers visible anywhere on the public web.**
- CTA on each card: "Open in app to contact".
- Programmatic landing pages: `/buy/buffalo`, `/buy/cow`, `/buy/buffalo/pune`, etc. — pre-generated for 7 types × 30 districts = 210+ indexable pages.
- Each programmatic page has unique H1, unique 80–120 word intro paragraph, FAQ schema, breadcrumbs.
- Pagination via `?page=2` (canonical points to page 1 of the series).

### Listing detail (`/buy/[id]`)

- Public, read-only.
- Photo carousel, full specs (breed, age, milk yield, calving history, description).
- Seller block: first name + district only. **No phone number, no last name, no avatar URL that leaks identity.**
- Primary CTA: "Open in Animall app to contact seller" → deep link `animall://listing/[id]` with fallback to Play Store + UTM tag.
- Related listings (same type, same district).
- `Product` schema.org markup → rich Google results.

### How it works (`/how-it-works`)

Two-column or tabbed: "I want to buy" / "I want to sell". Each: 4–5 steps with real app screenshots (no mockups), ending with download CTA.

### About (`/about`)

Founders' photos + bios, mission statement, the problem being solved, traction numbers (real), press logos if any, "join us" link to `/careers`.

### Blog (`/blog`, `/blog/[slug]`)

Phase 1: MDX in repo. Phase 3: consider headless CMS once content volume justifies it.
Categories: Breeds, Dairy Farming, Government Schemes, Animal Health, Marketplace Tips.
Editorial plan in `05-content-seo.md`.

### Partners (`/partners`)

Three sub-pitches stacked: vets, feed/fodder brands, financiers/insurers. Each ends with a contact form (Phase 1: `mailto:` link; Phase 4: HubSpot or Airtable form).

### Download (`/download`)

App store badges, QR code, "Add to Home Screen" PWA instructions, screenshots of the app, what's inside.

### Legal (`/legal/*`)

Privacy, Terms, Refund/Dispute, Cookie Policy. **Lawyer-reviewed before going live.** Blocker for any Play Store update or payment-gateway integration.

## 3. Core user flows

**Flow A — Cold buyer from Google**
1. Searches "buffalo for sale in Pune"
2. Lands on `/buy/buffalo/pune` (programmatic page)
3. Browses listings → clicks one
4. Reads `/buy/[id]` — wants to contact seller
5. Clicks "Open in app" → deep link or Play Store
6. Installs app → OTP login → contacts seller in-app

**Flow B — Cold seller from WhatsApp forward**
1. Friend shares the Animall website link
2. Lands on `/` → reads hero → clicks "How it works" → "I want to sell" tab
3. Sees 5-step process with screenshots
4. Clicks "Download app to list your animal" → Play Store
5. Installs → OTP → lists animal

**Flow C — B2B partner inquiry**
1. Lands on `/partners` from LinkedIn, search, or referral
2. Reads vet / feed / finance pitch
3. Submits form (Phase 4) or emails (Phase 1)
4. Internal team responds; leads tracked in CRM

**Flow D — Investor / press**
1. Lands on `/about`
2. Reads founders, mission, traction
3. Downloads press kit (Phase 4) or emails directly

## 4. Out of scope for the website (stays in the app)

- Posting a listing
- Contacting a seller
- Editing profile
- OTP authentication
- Notifications
- Any write operation against `/api/animals`

## 5. Content matrix

| Page | Marathi | Hindi | English | Indexable | Priority |
|---|---|---|---|---|---|
| `/` Home | Default | Yes | Yes | Yes | P0 |
| `/buy` and children | Yes | Yes | Yes | Yes | P0 |
| `/buy/[id]` | Yes | Yes | Yes | Yes | P0 |
| `/how-it-works` | Yes | Yes | Yes | Yes | P0 |
| `/about` | Yes | Yes | Yes | Yes | P0 |
| `/download` | Yes | Yes | Yes | Yes | P0 |
| `/legal/*` | EN OK only | — | Yes | Yes | P0 (legal blocker) |
| `/blog` | Optional | Optional | Yes | Yes | P1 |
| `/partners` | — | — | Yes | Yes | P1 |
| `/faq` | Yes | Yes | Yes | Yes | P1 |
| `/contact` | Yes | Yes | Yes | Yes | P1 |
| `/careers` | — | — | Yes | Yes | P4 |
| `/press` | — | — | Yes | Yes | P4 |

## 6. Component inventory (web-side)

Reused/ported from the app:
- `Button`, `Card`, `Input`, `Chip`, `Modal` (from `frontend/src/components/ui/`)
- `AnimalCard` — needs a public variant (no phone, "Open in app" CTA)
- `HeroBanner`, `IllustrationBanner` (from the refactored set in `frontend/IMPROVEMENTS_GUIDE.md`)

Net-new for web:
- `MarketingHeader` (sticky top nav with language switcher, app download)
- `MarketingFooter` (sitemap, social, legal, language, app badges)
- `SectionWrap` (consistent vertical rhythm for marketing sections)
- `Testimonial`, `LogoStrip`, `StatsBand`, `CTABand`
- `BlogPostCard`, `BlogToc`, `AuthorByline`
- `FilterBar` (web-optimized — sidebar on desktop, drawer on mobile)
- `Breadcrumbs` (with structured data)
- `LanguageSwitcher`

## 7. Acceptance criteria for "Phase 1 done"

- All P0 pages live in all P0 languages.
- Lighthouse mobile scores ≥ 90 for Performance, SEO, Accessibility on every page.
- Sitemap submitted to Google Search Console; first crawl confirmed.
- Legal pages signed off by counsel.
- Domain live with SSL.
- App download links work on Android (and iOS if Q7 confirms iOS app exists).
- Plausible analytics + GSC connected and capturing data.
- No broken links, no console errors, no layout shifts > 0.1 CLS.
