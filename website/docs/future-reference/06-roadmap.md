# 06 — Roadmap

> **Lens**: Delivery / engineering. What ships when, with dependencies and gates.

---

## Phase 0 — Founder alignment (week 0)

**Goal**: lock the strategic decisions that block design and tech.

- [ ] Founders complete `FOUNDER-QUESTIONS.md`
- [ ] Final wordmark / logo asset confirmed (SVG)
- [ ] Domain registered (e.g. `animall.in` or `animall.co.in`)
- [ ] Decision: same backend or read replica (recommendation: same)
- [ ] Legal counsel engaged for Privacy / Terms / Refund (parallel track — can finish during Phase 1)
- [ ] Brand do/don't list signed off (positioning, tone, imagery rules)
- [ ] Founder photos + bios collected for About page
- [ ] Traction numbers verified — what we can publish honestly

**Exit gate**: Q1–Q9 in `FOUNDER-QUESTIONS.md` answered.

---

## Phase 1 — Marketing MVP (weeks 1–3)

**Goal**: a public, indexable, credible marketing site. Listings come in Phase 2.

| Workstream | Deliverables |
|---|---|
| Engineering | Next.js scaffold in `/website/app/`; Tailwind tokens ported; i18n setup; deploy to Vercel with custom domain |
| Pages | Home, How It Works, About, Download, Partners (basic), Contact, FAQ, Legal (Privacy, Terms, Refund) |
| i18n | Marathi default, English secondary, Hindi stubbed (English fallback for missing keys) |
| Brand | MarketingHeader, MarketingFooter, base components, hero illustration |
| Distribution | App store badges, deep link skeleton, sitemap, robots, GSC + Plausible connected |
| Quality | Lighthouse mobile ≥ 90 across all pages; no console errors |

**Exit gate**: founders + legal sign off on copy and legal pages. Domain live with SSL.

---

## Phase 2 — Public listings + SEO engine (weeks 4–6)

**Goal**: public, indexable listings driving organic discovery.

| Workstream | Deliverables |
|---|---|
| Backend | New `/api/public/*` namespace with phone-stripping; integration test asserting no phone in response; rate limiting |
| Engineering | `/buy` browse page with FilterBar; `/buy/[type]` and `/buy/[type]/[city]` programmatic pages (210+); `/buy/[id]` listing detail with "Open in app" deep link |
| SEO | Structured data on all listings; hreflang for MR/HI/EN variants; sitemap auto-generates from `/api/public/sitemap-data` |
| Anti-thin-content | Build-time guard fails if a (type, city) page has < 3 live listings |
| Quality | Listing page Lighthouse mobile ≥ 90; sample listings indexed within 7 days of sitemap submission |

**Exit gate**: GSC accepts sitemap; sample listings visible in Google index.

---

## Phase 3 — Content & blog engine (weeks 7–10)

**Goal**: launch the content moat.

| Workstream | Deliverables |
|---|---|
| Engineering | MDX-based blog: `/blog`, `/blog/[slug]`, category and author pages |
| Content | First 12 posts published (`05-content-seo.md`); native-speaker reviewed; Hindi variants for top 3 |
| Conversion | Blog → app install CTAs contextualized per post category |
| Tracking | Goal funnels in Plausible: blog → listing → app install |

**Exit gate**: 12 posts live; first organic blog sessions visible in GSC and Plausible.

---

## Phase 4 — B2B & growth surface (weeks 11–14)

**Goal**: B2B revenue lane + press / investor surface.

| Workstream | Deliverables |
|---|---|
| Partners | Real partner inquiry forms (HubSpot or Airtable) on `/partners`; vet / feed / financier sub-pages |
| About / press | Founder bios with photos, press kit, press mentions, careers page |
| Social proof | Testimonial collection (real farmer quotes + photos); StatsBand on home |
| Growth | A/B testing framework (Vercel split testing) for hero copy and primary CTA |

**Exit gate**: at least 5 real testimonials live, first partner inquiry received and tracked in CRM.

---

## Phase 5 — Optimization & expansion (ongoing)

- Pan-India expansion: Hindi-belt city pages (UP, Bihar, MP, Rajasthan) — multiplies programmatic pages
- Dark mode parity with the app
- Programmatic blog: breed × district guide pages
- Affiliate / dealer portal (if business model in Q1 supports it)
- Email newsletter (weekly digest of listings + content)
- Shared `@animall/tokens` and `@animall/ui` packages — eliminate token duplication between app and web

---

## Cross-phase dependencies

| Item | Blocks | Owner |
|---|---|---|
| Founder Q1–Q9 answers | Phase 1 design | Founders |
| Logo SVG | Phase 1 launch | Founders / design |
| Domain | Phase 1 launch | Founders |
| Legal pages reviewed | Phase 1 launch | Legal counsel |
| `/api/public/*` endpoints + phone stripping | Phase 2 | Backend |
| Real testimonials | Phase 4 (do not fabricate) | Founders / community |
| Play Store listing live | Download CTA copy | Founders |

---

## Critical-path risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Legal review delays Phase 1 launch | Medium | Engage counsel in Phase 0; ship marketing site without legal-blocked CTAs if needed |
| Play Store listing not live by Phase 1 ship | Medium | Phase 1 has "Coming to Play Store soon" + waitlist email capture |
| Programmatic page quality (thin content) | High if unchecked | Build-time guard, unique copy per page, real listing data |
| Founder bandwidth for Q&A reviews | Medium | Async-first: founders answer in writing; sync only for unresolved items |
| Brand drift between app and web | Low (if tokens shared) | Token duplication acknowledged + tracked; refactor in Phase 5 |
| Scraper abuse of public API | Medium | Rate limit, phone stripping, monitor in Sentry/logs |

---

## What "done" looks like for each phase

A phase is **done** when:

1. Every checkbox in its scope is checked.
2. The exit gate is met.
3. Suryakant + at least one founder has reviewed the deployed result on a phone (not just on desktop).
4. A 1-page retro is written in `docs/retros/phaseN.md`, capturing what changed in the plan and why.

---

## Approximate effort estimate (subject to founder confirmation)

| Phase | Eng days | Design days | Content days |
|---|---|---|---|
| 0 | 1 | 1 | 2 |
| 1 | 12 | 4 | 4 |
| 2 | 10 | 2 | 3 |
| 3 | 4 | 2 | 12 |
| 4 | 6 | 3 | 4 |

Assumes one full-time engineer + part-time design + content contributor. Adjust based on Q21 answers.
