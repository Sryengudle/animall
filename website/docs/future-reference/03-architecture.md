# 03 — Architecture

> **Lens**: Senior architect. Tech stack, integration with existing app + backend, SEO mechanics, infra.

---

## 1. Tech stack — recommendation

**Framework: Next.js 14 (App Router)** — as a separate codebase from the existing Vite React app, sharing the same backend API.

### Why Next.js, not extending the current Vite app

- The Vite app is a private, authenticated PWA. Its CSR model is the wrong shape for SEO. Retrofitting SSR into Vite is possible but expensive and error-prone.
- Next.js gives the right mix the website needs: **SSG** for marketing pages, **ISR** for listing index pages, **SSR** fallback for listing detail with fresh data.
- App Router supports localized routing (`/mr`, `/hi`, `/en`) cleanly.
- `next/image` handles responsive images and AVIF/WebP automatically — important for a photography-heavy livestock site.
- Separate deployment, separate release cycle. Touching the marketing site does not risk the working app.

### Why not the alternatives

- **Astro**: best pure-static perf but weaker for the dynamic listing surface (filters, ISR).
- **Remix**: smaller momentum; no decisive advantage here.
- **Gatsby**: declining; build times scale poorly with 200+ programmatic pages.

### The full stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 App Router | React 18 under the hood — same mental model as the app |
| Language | TypeScript | App is JS; web is TS because type safety matters more for content-modeled site |
| Styling | Tailwind CSS | Same `tailwind.config.js` shape as the app, ported and extended |
| i18n | `next-intl` | Route-based `/[lang]/...` with type-safe message keys |
| Blog | MDX in repo (Phase 1) | Switch to Sanity/Strapi only when >30 posts |
| Forms | React Hook Form + Zod | Phase 2+; Phase 1 uses `mailto:` |
| Analytics | Plausible + Google Search Console | Privacy-friendly; no cookie banner needed |
| Hosting | Vercel | Best Next.js DX, automatic ISR, edge functions |
| DNS | Cloudflare | Free, fast, DDoS shield |
| Monitoring | Vercel Analytics + Plausible + (later) Sentry | |
| CI/CD | Vercel preview deploys per PR | Lighthouse budget enforced as a gate |
| Package manager | pnpm | Faster, deterministic |

## 2. Integration with the existing backend

The website is a **read-only consumer** of the existing Node/Express/Mongo backend. No new backend service is introduced.

### New endpoints required (additive)

| Endpoint | Purpose | Field stripping |
|---|---|---|
| `GET /api/public/animals` | Public paginated listings (no auth) | **Strip `sellerPhone`; mask `sellerName` to first name** |
| `GET /api/public/animals/:id` | Public listing detail | Same |
| `GET /api/public/stats` | Counts for trust strip | Total listings, active sellers, districts covered |
| `GET /api/public/sitemap-data` | Data for sitemap.xml generation | Types × cities × listing IDs |

**Critical rule**: the current `GET /api/animals` exposes `sellerPhone` in its response (see `backend/routes/animals.js`). **Do not point the website at that endpoint as-is.** Create the `/api/public/*` namespace explicitly, with field stripping enforced server-side. Add an integration test that asserts no public response contains `sellerPhone` or full `sellerName`.

### Rate limiting

Apply `express-rate-limit` to `/api/public/*` — 60 req/min per IP — to deter scrapers. The existing OTP rate-limit pattern (`server.js`) is the template.

### Deep links to the app

| Surface | Mechanism |
|---|---|
| Listing detail "Open in app" | Custom scheme `animall://listing/[id]` + fallback to Play Store with UTM tags |
| Universal / App Links | Set up once iOS and Play Store listings are live |
| Failure detection | Use 2-second timer trick: if scheme fails, redirect to store |

## 3. SEO mechanics

| Mechanism | Implementation |
|---|---|
| Server rendering | SSG for marketing, ISR (`revalidate: 600`) for listing index, SSR (`dynamic = "force-dynamic"`) for listing detail if freshness demands |
| Sitemap | `next-sitemap` + `/api/public/sitemap-data` → emits `sitemap.xml` at build, regenerates nightly |
| Robots.txt | Allow all public routes; disallow `/api/*` |
| Canonical URLs | Per page; localized variants linked via `hreflang` (`mr-IN`, `hi-IN`, `en-IN`) |
| Structured data | `Product` (listings), `ItemList` (browse pages), `Organization` (about), `FAQPage` (FAQ), `BreadcrumbList` (site-wide), `Article` (blog) |
| Open Graph / Twitter cards | Listing detail OG image = first photo; marketing pages = brand visual |
| Page speed | `next/image` everywhere; preload critical font subsets (Devanagari); defer non-critical JS; target Lighthouse mobile ≥ 90 |
| Programmatic pages | Pre-generate at build: 7 types × 30 districts = 210 pages, plus 7 type-only pages |

## 4. Folder structure (proposed)

```
website/
├── README.md
├── docs/
│   ├── 01-strategy.md … 06-roadmap.md
│   └── FOUNDER-QUESTIONS.md
└── app/                                # Created in Phase 1 kickoff
    ├── src/
    │   ├── app/
    │   │   └── [lang]/
    │   │       ├── layout.tsx
    │   │       ├── page.tsx            # /
    │   │       ├── buy/
    │   │       │   ├── page.tsx        # /buy
    │   │       │   ├── [type]/
    │   │       │   │   ├── page.tsx    # /buy/buffalo
    │   │       │   │   └── [city]/
    │   │       │   │       └── page.tsx # /buy/buffalo/pune
    │   │       │   └── [id]/page.tsx   # /buy/[id]
    │   │       ├── about/page.tsx
    │   │       ├── how-it-works/page.tsx
    │   │       ├── blog/
    │   │       ├── partners/page.tsx
    │   │       ├── download/page.tsx
    │   │       ├── contact/page.tsx
    │   │       ├── faq/page.tsx
    │   │       └── legal/{privacy,terms,refund}/page.tsx
    │   ├── components/
    │   │   ├── marketing/              # MarketingHeader, Footer, Hero, CTABand …
    │   │   ├── listings/               # PublicAnimalCard, FilterBar, ListingDetail
    │   │   ├── blog/                   # BlogPostCard, AuthorByline, BlogToc
    │   │   └── ui/                     # Button, Card, Input ported from app
    │   ├── lib/
    │   │   ├── api.ts                  # Public API client
    │   │   ├── seo.ts                  # Metadata helpers, schema.org builders
    │   │   └── i18n.ts                 # next-intl setup
    │   ├── content/blog/               # MDX posts
    │   ├── messages/{mr,hi,en}.json    # UI strings
    │   └── styles/globals.css
    ├── public/
    │   ├── images/                     # Imported from frontend/public/images
    │   ├── robots.txt
    │   └── og/                         # Pre-rendered OG images
    ├── next.config.mjs
    ├── next-sitemap.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── package.json
```

## 5. Shared design tokens

The website does not redefine the brand. Tokens flow from the app.

**Phase 1**: copy `frontend/tailwind.config.js` and `frontend/src/index.css` token definitions verbatim into `website/app/tailwind.config.ts`, with a header comment noting the duplication and a tracking task.

**Phase 2**: extract a `@animall/tokens` package (just CSS custom properties + a tailwind preset). Both apps consume it. Done when both apps build green against the package.

See `04-design-system.md` for the full token list.

## 6. Infra & ops

| Concern | Phase 1 | Later |
|---|---|---|
| Hosting | Vercel Free / Pro | Pro tier when traffic grows |
| DNS | Cloudflare (free) | — |
| SSL | Auto via Vercel | — |
| Backend | Same Node/Express instance — add `/api/public/*` routes | Separate read replica if traffic > 10k DAU |
| Monitoring | Vercel + Plausible | + Sentry, uptime monitor |
| CI/CD | Vercel auto-deploy `main`; PR previews | + typecheck, lint, Lighthouse budget gate |
| Secrets | Vercel env vars | Vault for multi-env |
| Backups | Mongo Atlas backups (existing) | — |

## 7. Security & privacy

- **Field stripping is server-side**, not client-side. Trust nothing in the public API response shape until the route handler enforces it.
- Mask seller name to first name only on public pages.
- `robots.txt` disallows `/api/*`.
- Rate limit public API at 60 req/min/IP.
- CSP header via Next.js middleware: restrict scripts to `self`, allow Plausible, no inline scripts (use nonces if needed).
- Minimal cookies. Plausible has no third-party cookies; no consent banner needed unless legal counsel says otherwise.
- Privacy policy must accurately reflect what is collected and stored.
- All forms (Phase 2+) get CSRF tokens and reCAPTCHA v3.

## 8. Performance budget

Hard budgets the site must meet — enforced as a Lighthouse CI gate on every PR:

| Metric | Budget |
|---|---|
| LCP (mobile) | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| First-party JS (per page) | < 150KB gzipped |
| Total page weight (median) | < 800KB |
| Lighthouse Performance (mobile) | ≥ 90 |
| Lighthouse SEO | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |

## 9. Open architecture decisions

See `FOUNDER-QUESTIONS.md`. Architecture-specific defaults below — say no if you disagree:

1. Same backend instance for public API (vs. read replica). **Default: same.** Revisit when traffic > 10k DAU.
2. MDX-in-repo vs. headless CMS for blog. **Default: MDX Phase 1.** Reassess at 30+ posts.
3. Vercel vs. self-host. **Default: Vercel.** Self-host is cheaper at scale but adds ops overhead.
4. TypeScript on the web even though app is JS. **Default: yes.** Content-modeled sites benefit; conversion later if needed.
