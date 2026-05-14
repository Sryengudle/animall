# 05 — Content & SEO

> **Lens**: Growth / content. How we win organic traffic and build the content moat.

---

## 1. SEO strategy in one sentence

Win long-tail Indian-language livestock queries via (a) programmatic listing pages by **type × city** and (b) evergreen blog content on **breeds, animal health, and government schemes** — then convert visitors into app installs.

## 2. Keyword pillars

| Pillar | Example queries | Page type | Volume estimate |
|---|---|---|---|
| Buy livestock | "buffalo for sale pune", "जर्सी गाय विक्री पुणे", "भैंस खरीदें" | Programmatic `/buy/[type]/[city]` | High, very long-tail |
| Breed info | "murrah buffalo price", "jersey cow milk yield" | Blog: breed guides | Medium, high intent |
| Animal care | "buffalo not giving milk reasons", "गाय आजार" | Blog: animal health | High, informational |
| Govt schemes | "PM Kisan registration", "dairy loan Maharashtra" | Blog: schemes | High, seasonal |
| Dairy business | "how to start dairy farm india" | Blog: business | Medium, high intent |
| Trust / brand | "is animall safe", "animall reviews" | About, FAQ, testimonials | Low but critical |

## 3. Programmatic pages strategy

**Phase 1 launch set:**

- Types: cow, buffalo, goat, sheep, chicken, pig, other → 7
- Maharashtra districts (top 30): Pune, Nashik, Nagpur, Aurangabad, Kolhapur, Satara, Sangli, Solapur, Ahmednagar, Latur, Amravati, Jalgaon, Akola, Beed, Buldhana, Wardha, Yavatmal, Chandrapur, Osmanabad, Parbhani, Hingoli, Nanded, Jalna, Dhule, Nandurbar, Raigad, Ratnagiri, Sindhudurg, Thane, Palghar
- Total Phase 1: **7 type pages + 210 type-city pages = 217 indexable browse pages**

**Quality bar — required for every programmatic page:**

- Unique `<h1>` (e.g., "Buffalo for sale in Pune — verified farmer listings")
- Unique 80–120 word intro paragraph (template-driven but with real district context — population, key breeds in the region, market days)
- At least 3 real listings live (do not publish a page that would show "no results")
- FAQ block (5 Q&As) with `FAQPage` schema — questions about pricing in that district, common breeds, what to ask sellers
- Breadcrumbs (`BreadcrumbList` schema)
- Internal links to neighboring districts and parent type page
- `ItemList` schema for the listings

**Anti-thin-content guard**: in CI, fail the build if any programmatic page would have < 3 live listings. Do not ship the page at all.

**Phase 2 expansion**: extend to Hindi-belt states (UP, Bihar, MP, Rajasthan) once Maharashtra is indexed and converting. Multiplies pages but only after volume justifies it.

## 4. Blog editorial plan — first 12 posts

Cadence: 1 post/week in Phase 1, scaling to 2/week in Phase 3.

| # | Title (working) | Languages | Category |
|---|---|---|---|
| 1 | Murrah vs Jaffarabadi buffalo — which is right for your farm | MR + EN | Breeds |
| 2 | How to read a cattle health record before buying | MR + EN | Marketplace tips |
| 3 | Top 10 dairy cow breeds in India with milk yield and prices | EN + HI | Breeds |
| 4 | Government dairy subsidy schemes 2026 — full guide | MR | Schemes |
| 5 | How to start a small dairy with 2 cows — capital, returns, risks | MR + HI | Business |
| 6 | Buffalo milk vs cow milk — what farmers should know | MR + HI | Animal health |
| 7 | Common cattle diseases in monsoon and prevention | MR | Animal health |
| 8 | PM-KISAN beneficiary status check — step by step | HI + MR | Schemes |
| 9 | How to negotiate when buying livestock — 7 farmer tips | MR | Marketplace tips |
| 10 | Setting up a goat farm in Maharashtra — costs and returns | MR + EN | Business |
| 11 | Why your buffalo isn't giving milk — 5 reasons | MR + HI | Animal health |
| 12 | Dairy loan options — bank, NBFC, cooperative — compared | EN + MR | Schemes |

**Editorial principles:**

- Every post has a real author byline (in-house or commissioned domain expert with credentials).
- No AI-generated content published without expert review.
- Every post ends with a contextual CTA — usually "Browse [type] listings near you" or "Download the app to start selling".
- Every post has at least one original photograph or diagram. No generic Unsplash imagery.
- Cross-link to programmatic pages: e.g., post #1 (Murrah) links to `/buy/buffalo` and `/buy/buffalo/pune`.

## 5. Off-page strategy

- **Google Business Profile** per city (Phase 3) — listing the Animall service in each district.
- **Outreach** to agricultural Marathi/Hindi YouTube channels and blogs for backlinks and reviews.
- **Partnerships** with agri-NGOs, KVKs (Krishi Vigyan Kendras), and dairy cooperatives — backlink exchange.
- **WhatsApp share loop** — every listing detail has prominent share buttons; track shares as a growth metric.
- **Press**: livestock and agritech publications (DownToEarth, RuralPulse, AgriBusiness Today).

## 6. Technical SEO checklist — Phase 1 acceptance

- [ ] All pages SSR/SSG rendered, viewable with JS disabled
- [ ] `sitemap.xml` generated and submitted to Google Search Console
- [ ] `robots.txt` allows public, disallows `/api/*` and `/_next/`
- [ ] Hreflang tags wire `/mr`, `/hi`, `/en` correctly
- [ ] Canonical URL on every page (no duplicate-content traps from query strings)
- [ ] Structured data validates: `Product`, `FAQPage`, `BreadcrumbList`, `Organization`, `ItemList`
- [ ] Open Graph + Twitter cards on every page
- [ ] Mobile-first viewport meta
- [ ] Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Lighthouse mobile: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95
- [ ] No interstitials or popups blocking mobile content
- [ ] 404 page exists, returns proper status code
- [ ] Redirect rules: trailing-slash policy enforced, lowercase URLs, www → non-www (or chosen direction)

## 7. Tracking & reporting

| Tool | Purpose | Setup |
|---|---|---|
| Google Search Console | Indexing, query data, impressions, clicks | Add domain property; submit sitemap |
| Plausible | Page views, referrers, top pages, goal funnels | Embed script in root layout |
| UTM tagging | Track app installs from web | Every Play Store / App Store link tagged `utm_source=web&utm_medium=[page]&utm_campaign=[surface]` |
| Play Store referrer | Confirm install attribution | Use Play Store install referrer API in app |

**Monthly review cadence** (Phase 1 + 30 days):

- New indexed pages
- Top organic queries
- Top organic landing pages
- App install rate from web traffic
- Top exit pages (where are we losing them?)

## 8. Content governance

- All copy in 3 languages goes through a native-speaker review before publishing. **No Google-translated production copy.**
- Blog posts have a versioning convention: republished posts increment `lastModified` (drives re-crawl).
- A "content review" task fires every 90 days to refresh evergreen posts.
- Outdated info (scheme amounts, contact numbers) is the #1 trust killer — keep a list of dated facts in a separate constants file.
