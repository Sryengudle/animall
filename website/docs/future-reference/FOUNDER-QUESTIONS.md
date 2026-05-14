# Founder Questions

These are the open decisions that block major design, tech, and content choices for the website. Please answer before Phase 1 kickoff. Some have a recommended default — say "OK" if you accept it, or override.

This doc is the **single source of truth** for the strategic inputs. Once filled in, every other doc in `/website/docs/` is downstream of these answers.

---

## A. Business & strategy

### Q1. Revenue model (today and 12 months out)
How does Animall make money, or how will it? Pick all that apply:

- [ ] Free for buyers/sellers (growth-first, monetize later)
- [ ] Listing fee per animal
- [ ] Commission on successful trade
- [ ] Premium seller subscription (boosted listings)
- [ ] B2B leads (vets, feed, finance)
- [ ] Ads
- [ ] Other: ___

**Why this matters**: shapes website CTAs, whether we need a pricing page, partner page priority.

### Q2. Geography — next 12 months
- [ ] Maharashtra only
- [ ] Maharashtra + adjacent states (Karnataka, Gujarat, MP)
- [ ] Pan-India

**Why this matters**: number of programmatic city pages, language priority order, hreflang strategy.

### Q3. Positioning — pick the closest one, or rewrite
- [ ] "The most trusted village livestock marketplace"
- [ ] "The simplest way to buy and sell farm animals"
- [ ] "Direct from farmer to farmer — no middlemen"
- [ ] Other: ___

**Why this matters**: hero headline, brand tone, founder narrative on About.

### Q4. Primary persona — who do we optimize for?
- [ ] Smallholder farmer selling 1–2 animals/year
- [ ] Active trader buying/selling weekly
- [ ] Commercial dairy operator
- [ ] All equally

**Why this matters**: home-page hierarchy, content tone, success-story selection.

### Q5. Single most important visitor action on the website?
- [ ] Download the app
- [ ] View a listing
- [ ] Sign up directly on the website
- [ ] Browse the blog
- [ ] Contact a partner

**Why this matters**: primary CTA placement, page layout priorities, conversion measurement.

---

## B. Product surface

### Q6. Public listings on the website (no login)
**Recommendation**: Yes, with phone numbers stripped server-side and "Open in app" CTA on every listing. This is the entire SEO play.

**Risk**: scraping, fake-buyer abuse. **Mitigation**: rate limit, hide seller phone, mask name to first name only.

Confirm: [ ] Yes / [ ] No / [ ] Yes but only some fields (specify): ___

### Q7. App store status
- Play Store: [ ] Live / [ ] Pending / [ ] Not started — link or ETA: ___
- App Store (iOS): [ ] Live / [ ] Pending / [ ] Not started — link or ETA: ___

**Why this matters**: "Download" page content, fallback strategy if not live by Phase 1 ship.

### Q8. Phone numbers on the website
Recommendation: **never** show seller phone numbers on the web. The OTP-app contact flow is the only path. Phone numbers on the website are a fraud and scraping magnet.

Confirm: [ ] Agree / [ ] Disagree (please explain): ___

### Q9. Multilingual priority at launch
Default plan:
- **Phase 1**: Marathi (default), English
- **Phase 2**: Hindi
- **Phase 3+**: regional expansion if pan-India

Confirm or override: ___

---

## C. Brand & content

### Q10. Logo / wordmark
- Final logo file (SVG): [ ] Available / [ ] Need to commission / [ ] Use current app emoji-text mark temporarily
- Final tagline:
  - Marathi: ___
  - Hindi: ___
  - English: ___

### Q11. Founder bios + photos for About page
- Founder 1 — name, role, short bio (3–4 lines): ___
- Founder 2 — name, role, short bio (3–4 lines): ___
- High-res photos: [ ] Available / [ ] Will provide by ___ / [ ] Use illustrated avatars for now

### Q12. Traction numbers we can publish honestly
- Listings created to date: ___
- Active sellers: ___
- Districts covered: ___
- Successful trades (if measurable): ___
- Any other public-shareable metric: ___

**Rule**: do not inflate. If small, frame as "since launch on [date]". If unknown, omit and use illustrations.

### Q13. Real testimonials / case studies
- [ ] Yes — names, photos, quotes are available now
- [ ] We can collect within 2 weeks (commit to a date): ___
- [ ] Not yet — leave the section out entirely until real ones exist

**Rule**: we do not fabricate testimonials. Ever.

### Q14. Blog authors
- [ ] In-house (who? language ability?): ___
- [ ] Commission agri-expert writers (budget per post?): ___
- [ ] Both

---

## D. Operations & legal

### Q15. Domain
- Preferred domains in order: ___, ___, ___
- Already registered: [ ] Yes (which one): ___ / [ ] Not yet

### Q16. Legal counsel
- [ ] We have a lawyer engaged
- [ ] We need a recommendation
- Timeline to receive final Privacy / Terms / Refund policies: ___

### Q17. Hosting budget
- [ ] OK with Vercel Pro (~$20/month per seat) for Phase 1
- [ ] Prefer to self-host on the same VPS as the backend
- [ ] No preference — decide on cost

### Q18. CRM for B2B inquiries (used from Phase 4 onward)
- [ ] HubSpot Free
- [ ] Airtable
- [ ] Google Sheet + email (Phase 1 only acceptable)
- [ ] Already using: ___

---

## E. Roadmap & runway

### Q19. Target launch date for Phase 1 (marketing MVP)
- Hard date: ___
- Or flexible / "as soon as quality is met": ___

### Q20. Fundraising in the next 6 months?
- [ ] Yes — `/about` and `/press` become Phase 1 priority instead of Phase 4
- [ ] No
- [ ] Maybe — what would change that decision: ___

### Q21. Team & bandwidth
- Design: who, full/part time: ___
- Engineering: who, full/part time: ___
- Content / SEO: who, full/part time: ___
- Or: all built by Suryakant + Claude + commissioned help — confirm: [ ]

---

## F. Anything we haven't asked

What else should the website convey, accomplish, or avoid that we haven't surfaced here?

___

---

## How to answer

Two options:

1. **Async (preferred)** — edit this file directly. Each founder fills in their answers; if you disagree, write "Founder A: …" and "Founder B: …" and we'll resolve.
2. **Sync** — 30-minute call covering Q1–Q9 (the hard blockers). Q10–Q21 can follow async.

Once filled in, Phase 1 starts.
