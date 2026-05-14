# 01 — Strategy

> **Lens**: CEO / founder. What we're building, for whom, and why now.

---

## 1. The product, in one paragraph

Animall is a Marathi-first livestock marketplace PWA that lets farmers and traders in rural Maharashtra buy and sell cattle, buffalo, goats, sheep, and other farm animals. Authentication is OTP-based (mobile-first, no email). Sellers list animals with photos, breed, age, milk yield, and price; buyers browse, filter, and contact directly via phone/WhatsApp. The app is live and functional today; its surface is private (login-required) and invisible to search engines.

## 2. Why a website now

The app's biggest growth bottlenecks are not feature gaps. They are **discoverability and trust**. A website is the cheapest, highest-leverage way to unlock both.

| Bottleneck today | What it costs us | What the website solves |
|---|---|---|
| Zero SEO presence | Every "buffalo for sale Pune" search goes to OLX, Quikr, Pashushala | Public, indexable listing pages + structured data |
| No "real company" face | Investors, vets, feed brands, banks have nowhere to evaluate us | About, founders, mission, traction |
| Login wall on first touch | Cold visitors abandon — they want to *see* before signing up | Public read-only catalog; contact requires app |
| No content moat | Farmers Google breed and scheme info in Marathi — we are absent | SEO blog: breed guides, dairy tips, govt schemes |
| No B2B surface | Vets, feed brands, financiers can't find or partner with us | Partner page, dealer enrollment, B2B contact |
| App store / payment gateway gaps | Privacy policy, T&Cs, refund policy are required artifacts | Legal pages live on web |

## 3. Audiences (in priority order)

1. **Cold buyer (farmer or trader)** — searches Google in Marathi/Hindi for an animal, lands on a listing page, downloads the app to contact the seller.
2. **Cold seller** — receives a WhatsApp forward, visits the site, learns how listing works, downloads the app.
3. **Investor / press / strategic partner** — evaluates company credibility, founders, traction, vision.
4. **B2B partner** — vet clinic, feed brand, dairy co-op, insurance, NBFC — looking for distribution.
5. **Regulator / app store reviewer** — needs to see legal pages, contact info, ownership.

These are *different* visitors. The site must serve all five without collapsing into a generic product landing page.

## 4. Positioning (working draft — to validate with founders)

> **Animall is rural India's trusted village livestock marketplace — buy and sell cows, buffalo, and goats directly from verified farmers, in your language, on your phone.**

**Differentiation pillars:**

- **Trust** — OTP-verified sellers, real phone numbers, no fake listings (vs. Facebook groups and classifieds).
- **Language-native** — Marathi-first, then Hindi, then English. Not a Hindi/English app translated to Marathi.
- **Mobile-first PWA** — works on low-end phones, low data, no app-install friction.
- **Direct** — buyer talks to seller; no middleman price gouging.
- **Agricultural heritage** — built for farmers, not for urban resellers.

The visual identity (emerald + warm amber, Noto Sans Devanagari, photographic farmer imagery) is already established in the app and carries over directly. See `04-design-system.md`.

## 5. Business model — implications for the website

The website's CTAs depend on the revenue model. Until founders confirm (see `FOUNDER-QUESTIONS.md` Q1), the plan assumes:

- **Primary CTA**: Download the app (Play Store / App Store badges). All paths funnel here.
- **Secondary CTA**: View a listing → "Open in app to contact seller" (drives installs).
- **Tertiary CTA**: B2B partner inquiry (vet / feed / financier).

If the model becomes commission-based or premium-seller, the site later adds pricing/membership pages without restructuring.

## 6. Success metrics

Measure the website against funnel stages, not vanity metrics. Targets are intentionally **not set until baseline is established** (Phase 1 + 30 days):

| Stage | Metric | Why it matters |
|---|---|---|
| Discovery | Organic sessions/month from livestock keywords | Proves SEO is working |
| Engagement | Listing-detail views per session | Cold visitors actually looking at animals |
| Conversion | App install rate from website (Play Store referrer tag) | The closest thing to revenue |
| Trust | Bounce rate on About / Founders / How It Works | Signals credibility |
| Content | Blog post sessions + assisted conversions | Long-term moat |
| B2B | Partner inquiries / month | Second revenue lane validation |

## 7. What this website is NOT

To prevent scope creep, calling these out explicitly:

- It is **not** a second buying/selling surface. Transactions stay in the app.
- It is **not** a generic SaaS landing page with feature grids and pricing.
- It is **not** a re-skin of the app's home screen.
- It is **not** an admin panel — that is a separate internal tool.
- It is **not** where notifications, chat, or auth live.

## 8. Strategic risks

| Risk | Mitigation |
|---|---|
| SEO is a 6–9 month investment; founders may want immediate ROI | Set expectations in `06-roadmap.md`; report leading indicators (indexed pages, impressions) early |
| Public listings raise scraper / fraud risk | Server-side phone-stripping, masked seller names, rate-limited public API |
| Two languages × programmatic pages = content explosion | Phase 1: Marathi + English. Cap programmatic pages by type × top-30 districts |
| Brand drift between app and web | Single source of truth for design tokens (extract to `@animall/tokens` in Phase 2) |
| Building a second codebase doubles maintenance | Marketing pages are content-driven (MDX); only the listing-browse surface is dynamic |
| Founders disagree on positioning post-launch | Make positioning a Phase 0 sign-off artifact — not a Phase 2 surprise |

## 9. The CEO question to keep asking

> *"If a farmer in Solapur Googled 'भैंस विक्री' tomorrow and clicked our top result, would she trust us enough to download the app?"*

Every page, every photo, every line of copy must clear that bar. If it doesn't, cut it.
