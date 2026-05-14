# V1 Plan — Animall Static Website

> The actionable plan. Reading this is enough to start building.

**Decision**: a static React website. 7 pages. Reuses the app's tech and brand. Ships in 10–14 days. No backend integration. No public listings yet. No blog yet. Marketing + credibility first; the listing catalog and blog come in V2 once V1 is live and we have real traffic to learn from.

---

## 1. Why this stack — and why not the alternatives

| Stack option | Verdict | Why |
|---|---|---|
| **Vite + React + react-snap** (the pick) | ✅ | Same tools as your app. Pre-rendered to real HTML at build = Google sees real content. Zero servers. |
| Next.js | ❌ for V1 | Overkill for 7 static marketing pages. Adds learning curve. Revisit only when you want indexed listing pages (V2+). |
| Pure HTML + CSS | ❌ | You already know React; component reuse from the app saves time. |
| Astro | ❌ | New framework. You said "only React." |
| Existing app extended | ❌ | The app is a private PWA. Mixing public marketing into it bloats the bundle and complicates auth. |

## 2. The exact stack

| Layer | Choice | Notes |
|---|---|---|
| Build | Vite 5 | Same major version as the app |
| UI | React 18 | Same as the app |
| Routing | React Router 6 | Same as the app |
| Styling | Tailwind CSS | Copy `frontend/tailwind.config.js` tokens verbatim |
| i18n | `react-i18next` | Same pattern as `frontend/src/i18n/*` |
| Pre-rendering for SEO | `react-snap` | Runs headless Chrome at build, saves each route as HTML |
| Per-page meta tags | `react-helmet-async` | Title, description, OG tags |
| Contact form | Formspree free tier | No backend needed |
| Analytics | Plausible (free) + Google Search Console | Privacy-friendly, no cookie banner |
| Deploy | Vercel free tier | Auto-deploy on git push |
| Domain | `animall.in` or `animall.co.in` | You buy; we point DNS |

Total monthly cost at V1 traffic: **₹0 + domain (~₹600/year)**.

## 3. The 7 pages

| # | Route | Purpose | Primary CTA |
|---|---|---|---|
| 1 | `/` Home | Pitch + value props + how it works + download | Download App |
| 2 | `/about` | Mission, founders, story | Download App |
| 3 | `/how-it-works` | Buyer + seller walkthroughs with screenshots | Download App |
| 4 | `/features` | What the app does (photos, OTP, verified, multi-language) | Download App |
| 5 | `/download` | Play Store + QR + PWA install instructions | Open Play Store |
| 6 | `/contact` | Email + Formspree form | Send message |
| 7 | `/legal` | Privacy + Terms + Refund on one page with anchors | — |

Plus a `/404` page and the Marathi/English routing (`/mr/*` default, `/en/*` secondary, Hindi in V2).

**That's it.** No blog, no public listings, no programmatic city pages, no dark mode, no newsletter. Those come in V2 after V1 ships.

## 4. Home page wireframe

```
┌──────────────────────────────────────────────────────────┐
│ HEADER                                                    │
│ 🐄 Animall   How it works · About · Download   मराठी ⌄ │
├──────────────────────────────────────────────────────────┤
│                                                            │
│   HERO (above the fold on mobile)                         │
│                                                            │
│   गावाचा विश्वासू जनावर बाजार                            │
│   Buy and sell livestock directly with verified farmers   │
│                                                            │
│   [ Download App ↓ ]   [ See how it works ]              │
│                                                            │
│              [farmer-with-cows illustration]              │
│                                                            │
├──────────────────────────────────────────────────────────┤
│   TRUST STRIP                                              │
│   ✓ X verified sellers  ✓ Y districts  ✓ 7 animal types │
├──────────────────────────────────────────────────────────┤
│   HOW IT WORKS                                             │
│                                                            │
│   For Buyers                For Sellers                   │
│   1. Browse listings        1. Post your animal           │
│   2. Pick what you like     2. Get verified buyers        │
│   3. Open app to contact    3. Sell directly              │
│                                                            │
├──────────────────────────────────────────────────────────┤
│   FEATURES (4 cards with icons)                            │
│   Real photos · OTP-verified sellers ·                    │
│   Detailed specs · 3 languages                            │
├──────────────────────────────────────────────────────────┤
│   TESTIMONIALS  (omit until we have real ones)            │
├──────────────────────────────────────────────────────────┤
│   B2B BAND                                                 │
│   Vets, feed brands, financiers — partner with us         │
│   [Email us]                                              │
├──────────────────────────────────────────────────────────┤
│   FINAL CTA                                                │
│   [ Download App on Play Store ]   [ QR code ]            │
├──────────────────────────────────────────────────────────┤
│   FOOTER                                                   │
│   Language · Social · Legal · Contact · Sitemap           │
└──────────────────────────────────────────────────────────┘
```

## 5. Visual direction (carry-over from the app — non-negotiable)

- **Colors**: emerald primary `#047857`, warm amber accent `#D97706`, warm sage neutrals — never pure white.
- **Fonts**: Noto Sans + Noto Sans Devanagari.
- **Imagery**: real Indian farmers + livestock photos + the farmer-with-cows illustration in `frontend/IMAGE_ASSETS_GUIDE.md`. **No corporate stock photos. No cartoon animals. No urban imagery.**
- **Tone**: warm, peer-to-peer, vernacular. Direct. Never "fintech-slick" or buzzword-heavy.

## 6. Folder structure

```
website/
├── V1-PLAN.md                  ← this doc
├── README.md
├── docs/future-reference/      ← long-term plan for V2+ (read later)
└── app/                        ← created on Day 1
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx             ← React Router setup
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── About.jsx
    │   │   ├── HowItWorks.jsx
    │   │   ├── Features.jsx
    │   │   ├── Download.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Legal.jsx
    │   │   └── NotFound.jsx
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Hero.jsx
    │   │   ├── TrustStrip.jsx
    │   │   ├── FeatureCard.jsx
    │   │   ├── CTABand.jsx
    │   │   ├── LanguageSwitcher.jsx
    │   │   └── ui/             ← Button, Card, Input copied from app
    │   ├── i18n/
    │   │   ├── index.js
    │   │   ├── mr.json
    │   │   └── en.json
    │   ├── content/            ← static content (FAQ, features list, etc.)
    │   └── styles/index.css    ← Tailwind directives + tokens
    ├── public/
    │   ├── images/             ← copy from frontend/public/images/
    │   ├── robots.txt
    │   ├── sitemap.xml         ← generated
    │   └── favicon.svg
    ├── index.html
    ├── tailwind.config.js      ← copied from app, light edits
    ├── vite.config.js
    └── package.json
```

## 7. Timeline (10–14 days of focused work)

| Day | Output |
|---|---|
| 1 | Vite scaffold, Tailwind, Router, i18n, react-snap, deploy hello-world to Vercel |
| 2 | Header, Footer, design tokens ported, base components, page shells |
| 3 | Home page — hero, trust strip, how-it-works |
| 4 | Home page — features, B2B band, final CTA, mobile polish |
| 5 | About + How It Works pages |
| 6 | Features + Download pages |
| 7 | Contact (Formspree) + Legal pages |
| 8 | Full Marathi translations |
| 9 | English translations + language switcher polish |
| 10 | SEO: meta tags, OG images, sitemap, robots, Organization schema |
| 11 | react-snap prerender, Lighthouse audit, fix to mobile ≥ 90 |
| 12 | Domain DNS, SSL, Plausible + GSC verified |
| 13 | Founder review on phone + fixes |
| 14 | Ship |

## 8. What we need from you to start (the bare minimum)

Not 21 questions. Just these:

1. **Domain** — buy `animall.in` (recommended) or `animall.co.in`. Tell me which when registered.
2. **Play Store** — is the app live? If yes, the URL. If no, V1 says "Coming soon" + email capture.
3. **Logo SVG** — if you have one. If not, V1 launches with the app's existing cow-emoji + wordmark.
4. **Founders** — both names, roles, 3-line bios each, one photo each. If photos not ready, illustrated placeholders.
5. **Honest numbers** — listings created, sellers, districts. If small or zero, we frame as "since launch" or omit numbers entirely. Never inflate.

Everything else (revenue model, geography expansion, blog strategy, B2B CRM choice) — I'll make sensible defaults and you can change anything later. V1 ship is not blocked on those.

## 9. What's intentionally NOT in V1

- ❌ Public listings on the web (V2)
- ❌ Blog (V2)
- ❌ Programmatic city pages (V2)
- ❌ Hindi version (V2)
- ❌ B2B forms with CRM (V1 uses `mailto:`)
- ❌ Dark mode (V2)
- ❌ Newsletter signup
- ❌ Login / signup on the website
- ❌ Anything that talks to the backend

V1 is **just** the marketing surface. Once it's live and visitors are arriving, V2 priorities become data-driven (which pages convert, which traffic sources work, what content people search for).

## 10. V1 → V2 evolution path

When V1 has been live for ~30 days and has baseline traffic data:

1. Add public listing pages (`/buy/[type]`, `/buy/[city]`) — at this point migrate to Next.js for SSR/ISR, since SEO depends on fresh content.
2. Add blog (start with 4–6 evergreen posts in Marathi).
3. Add Hindi version.
4. Add real B2B partner forms with CRM.

The long-term thinking for all of this is in `docs/future-reference/`. Don't read it now — V1 ship is what matters.

## 11. Ready check

When you say "go," I:
1. Create `website/app/` with the Vite + React + Tailwind + Router + i18n + react-snap scaffold
2. Build Header, Footer, and the Home page first
3. Show you the local dev result for review before continuing to the other pages

Or if you want to lock specific things first (domain, logo, founder bios), tell me which.
