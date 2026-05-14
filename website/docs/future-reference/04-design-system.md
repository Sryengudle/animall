# 04 — Design System

> **Lens**: Design lead. How the website inherits the app's brand and where it extends.

---

## 1. Brand carry-over from the app

The Animall app already has a defined visual identity in `frontend/tailwind.config.js` and `frontend/src/index.css`. The website **inherits** rather than reinvents.

| Token | Value | Notes |
|---|---|---|
| Primary | Emerald `#047857` (600) | Buttons, links, accents |
| Brand scale | Emerald 50–900, stable across light/dark | Hero sections, key CTAs |
| Accent | Warm amber `#D97706` (600) | Secondary CTAs, highlights |
| Surface | Warm sage neutrals (cream-tinted) | Backgrounds — never pure white |
| Success | Emerald | Success states |
| Warning | Amber | Warnings |
| Danger | Red | Errors, destructive actions |
| Info | Blue | Informational |
| Font (Latin) | Noto Sans | Body, UI |
| Font (Devanagari) | Noto Sans Devanagari | Marathi, Hindi |
| Radius scale | sm / md / lg / xl / 2xl | Cards, buttons, inputs |
| Shadow tokens | `card`, `button`, `glass` | Layered depth |
| Animations | shimmer, fade-up, pulse-soft, float | Loading states, hero |

These are non-negotiable. Any new design decision must trace back to a token here, or extend the system (with sign-off).

## 2. Web extensions to the system

The app is mobile-first. The web has additional needs:

- **Wider grid**: 12-column grid, 1280px max content width, generous gutters.
- **Display type scale**: add `display-xl` (60/72), `display-lg` (48/56), `display-md` (36/44) for hero headlines.
- **Section spacing scale**: `section-sm` 64px, `section-md` 96px, `section-lg` 128px vertical rhythm.
- **Container queries** for components that appear in both narrow and wide containers (cards, etc.).
- **Hover and focus states**: app has minimal hover (touch device); web adds proper hover/focus for cards, links, buttons, nav.
- **Dark mode**: app supports it; **website Phase 1 = light only**, dark mode in Phase 2 to keep launch lean.
- **High-contrast focus rings**: 2px emerald-600 outline + 2px offset. Accessibility-first.

## 3. Component reuse plan

| Component | App location | Website plan |
|---|---|---|
| `Button` | `frontend/src/components/ui/Button` | Port to web; add `marketing` variant (larger, gradient option) |
| `Card` | `frontend/src/components/ui/Card` | Port; add marketing card variants |
| `Input` | `frontend/src/components/ui/Input` | Port for contact / partner forms |
| `Chip`, `Modal` | `frontend/src/components/ui/` | Port as-is |
| `AnimalCard` | `frontend/src/components/common/AnimalCard` | Port; create `PublicAnimalCard` variant (no phone, "Open in app" CTA) |
| `HeroBanner` | `frontend/src/components/common/HeroBanner` (per `IMPROVEMENTS_GUIDE.md`) | Reuse; add size variants |
| `IllustrationBanner` | per `IMPROVEMENTS_GUIDE.md` | Reuse for mid-page sections |
| `Header` | `frontend/src/components/common/Header` | Replace with `MarketingHeader` — different IA |
| `BottomNav` | `frontend/src/components/common/BottomNav` | Not used on web — sticky top nav instead |

Long-term: extract a `@animall/ui` package shared by both apps. Short-term (Phase 1–2): copy and diverge cleanly, with a tracking task to refactor.

## 4. Net-new web-only components

- `MarketingHeader` — sticky, with primary nav, language switcher, app download CTA.
- `MarketingFooter` — sitemap, social, legal, language switcher, app store badges, contact.
- `SectionWrap` — consistent vertical rhythm.
- `Testimonial` — quote + photo + name + district.
- `LogoStrip` — for press / partner logos.
- `StatsBand` — animated counter for "X verified sellers • Y listings".
- `CTABand` — full-width CTA strip (used at bottom of most pages).
- `BlogPostCard`, `AuthorByline`, `BlogToc`, `RelatedPosts`.
- `FilterBar` — sidebar on desktop, bottom drawer on mobile.
- `Breadcrumbs` — with `BreadcrumbList` schema.
- `LanguageSwitcher` — preserves current route when switching.
- `AppStoreBadges` — Play Store + App Store (when iOS ships).
- `QRCode` — for `/download`.

## 5. Imagery direction

Already documented in `frontend/IMAGE_ASSETS_GUIDE.md`. Website inherits:

- **Photographic real livestock and farmers** (commissioned or licensed). No corporate stock cliches.
- **Warm illustrations** for hero and process diagrams (4:3, warm palette `#F5E6C8` background).
- **Format**: WebP with JPEG fallback. `next/image` handles this automatically.
- **Aspect ratios**: 4:3 for cards, 16:9 for hero, 1:1 for testimonials.
- **Performance**: every image lazy-loaded except above-the-fold hero (which is preloaded).
- **Alt text**: never decorative-only. Describe what's in the image; in Marathi where the page is Marathi.

**Non-negotiable brand rules:**

- No generic "smiling people in suit" stock photos.
- No urban-coded imagery.
- No cartoon animals on production pages (illustrations are stylized but realistic).
- Always show real Indian farmers, not generic Asian or generic farmer imagery.

## 6. Tone of voice

| Trait | Yes | No |
|---|---|---|
| Default language | Marathi (vernacular, warm, direct) | Formal corporate-speak |
| English variant | Plain, agricultural-respectful, specific | "Fintech-slick", buzzword-heavy |
| Numbers | "4,200 verified sellers" | "Trusted by many" |
| Descriptions | "Murrah buffalo, second calving, 12 L/day" | "High-quality livestock asset" |
| Voice | Farmer-to-farmer, peer | Brand-to-consumer, top-down |
| Punctuation | Calm | Exclamation-heavy, urgency-driven |

**Words to avoid**: seamless, revolutionary, AI-powered, ecosystem, transform, journey, empower.

**Words to prefer**: trusted, direct, verified, in your language, in your village, real, simple.

## 7. Layout language

Across all pages, follow this rhythm:

1. **Above the fold**: one clear headline + one primary CTA. No competing CTAs.
2. **Section spacing**: alternate `section-md` (96px) and `section-lg` (128px). No tight stacks.
3. **Sections alternate**: surface-default → surface-tinted (warm sage) → surface-default, to give visual rhythm without changing brand color.
4. **Images breathe**: don't crop tight to subject. Generous whitespace around photographs.
5. **Cards**: light shadow (`card` token), 16px radius, 24px internal padding.
6. **Buttons**: primary = emerald-600 with `button` shadow; secondary = outline emerald-600; tertiary = text link with underline on hover.

## 8. Accessibility floor

- Color contrast: AA minimum (AAA for body text).
- Focus visible everywhere keyboard-navigable.
- Skip-to-content link in every header.
- Form labels associated with inputs.
- Heading hierarchy: one H1 per page; no skipping levels.
- `lang` attribute set correctly per route (`mr-IN`, `hi-IN`, `en-IN`).
- Devanagari font loads before content paints (FOIT acceptable for legibility).
- All non-decorative images have meaningful alt text.

Target: Lighthouse Accessibility ≥ 95 per page.

## 9. Reference: copy the app's tokens verbatim

For Phase 1, the literal source of truth is `frontend/tailwind.config.js`. Open it, copy the `theme.extend.colors`, `theme.extend.fontFamily`, `theme.extend.boxShadow`, `theme.extend.borderRadius`, and `theme.extend.keyframes` blocks into `website/app/tailwind.config.ts`. Add the web extensions (display type scale, section spacing) on top.

This duplication is intentional and short-lived. Tracking task: extract `@animall/tokens` in Phase 2.
