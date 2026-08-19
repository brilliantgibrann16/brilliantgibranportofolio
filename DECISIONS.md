# Decision Ledger

Binding until explicitly revoked. Newest first.

## 2026-07-27 — v2.0 "OPEN ANATOMY" build (concept in CONCEPT.md, verified in-browser)

| Decision | Rationale | Rejected alternative |
|---|---|---|
| Concept = **OPEN ANATOMY**: press X and the site dissects itself (grid rails, section anatomy tags, live FPS/LCP/CLS/DOM/transfer HUD, hover token inspector) | The only direction where the flex is inherent — the mechanism demonstrating the craft *is* the craft; zero fakeable content | SYS.GIBRAN personal-OS (prior-art crowded); BUKTI evidence-dossier as lead (artifact shortage) — its evidence-slot structure shipped inside project panels instead |
| **Dark is canonical**; light only via explicit toggle choice | Owner's INITIAL_CONCEPT states dark theme; OS preference no longer overrides | prefers-color-scheme default (contradicted the stated concept) |
| **Fonts self-hosted**, 4 files/120KB: inter-var (400–900), scp-var (400–700), dmserif ×2; Playfair deleted; 3 preloads; CSP now fully self-contained (`font-src 'self'`, zero external requests site-wide) | Kills the render-blocking Google Fonts chain (PERF-01) + GDPR exposure (SEC-05); Google served variable fonts — 12 downloaded files collapsed to 4 (8 were byte-identical) | Slimmed Google URL (still third-party, still render-blocking) |
| Value prop rewritten: title "CS Student · UX, Data & Security", tagline "Figma to PostgreSQL to Docker — then I try to break it with Kali", status pill says **internships** above the fold, stats "1st Year — CS Student / 7 Projects Built" | COPY-01/04, UX-009: label→claim, grammar fixed, "Shipped"→"Built" (honest for coursework) | — |
| Every project panel now carries **role line + artifacts list + "request the full documentation" mailto + prev/next + Escape + `#p-<id>` deep links** | COPY-02/JRN-01/UX-012 dead-ends; artifacts derived strictly from existing descriptions — nothing invented | Fabricated repo links (forbidden); separate case-study pages (deferred to Track B, needs real content) |
| Contrast pass: all `#999/#aaa/#bbb/#ccc/#888/#777` micro-label colors → theme tokens; light `--text-faint` → `#6e6e76` | UX-003/A11Y-04: 22 failing usages now ≥4.5:1 via tokens, both themes | Per-rule hex tweaks (recreates the drift) |
| JS motion behind one `REDUCED` gate: typewriter/counters instant, canvas removed, magnetic/tilt/parallax/splitting skipped; orbital canvas pauses offscreen + tab-hidden | A11Y-03, PERF-06 | — |
| Form: honeypot `_gotcha`, autocomplete, inline `role=alert` error (no more `alert()`), 12s fetch timeout, `role=status` success with focus | A11Y-06/07, UX-008, SEC-04, CODE-06 | — |
| Headings: one h1 + six real h2s (section labels promoted with `aria-label`); scroll-spy `.nav-link.active`; nav order = document order; hamburger + nav hide x-ray toggle <840px | SEO-01/A11Y-01, UX-005/006 | — |
| 30KB base64 id-card → `id-photo.jpg` 4.2KB (128×128); noise-texture.png (51KB) → inline SVG turbulence; paper texture not fetched in dark | PERF-02/04 | — |
| `404.html` (4.2KB, self-contained, concept voice); image/font cache headers + `base-uri`/`object-src` in vercel.json | UX-019, PERF-03, SEC-03 | — |

**Verified:** 0 console errors across all runs; 0 external requests; fonts load from `/fonts/`; x-ray on/off (Esc, button aria-pressed, mobile no-op + hidden); 375px shows all 3 stats + all 3 CTAs, no horizontal overflow; light+dark both shot; deep-link `#p-suaraku` renders 3 artifacts + request CTA + prev/next.
**Known gap (deliberate):** x-ray does not re-measure section boxes when content height changes while open (press X twice); per-project case-study pages remain Track B.

## 2026-07-27 — Deep-Audit component completion (post-Track-A)

Master audit prompt's named on-page checks that were still missing, now shipped and browser-verified:

| Decision | Rationale |
|---|---|
| Hero name `div` → the page's single `<h1>` | One-H1 rule; heading order is now h1 → h2 (about) → h2 (contact); zero visual change (all styling is class-based, universal reset kills UA margins) |
| JSON-LD `ProfilePage`→`Person` in `<head>` | Entity building: name, jobTitle, Jakarta address, Cakrawala affiliation, `sameAs` (LinkedIn/GitHub/Instagram), `knowsAbout` — only facts already stated on the page, nothing invented |
| `<main id="main" tabindex="-1">` wraps hero→contact + fixed skip link (`.skip-link`, first focusable element) | Semantic landmarks + WCAG 2.4.1; skip link is keyboard-only (off-screen until `:focus`), themed with tokens |
| `Strict-Transport-Security: max-age=63072000; includeSubDomains` added to `vercel.json` | Vercel usually injects HSTS, but the header set is our declared control — explicit beats platform default; `preload` deliberately omitted (irreversible directive) |
| `sitemap.xml` lastmod → 2026-07-27 | Content materially changed today |

**Known context:** the original Deep-Audit report (D0–D5) that defined Track A is NOT in this workspace — completeness was verified against the audit prompt's own named component checks, not the lost item list. Remaining prompt scope (PRD v2.0, CMS/CRM/analytics integrations, automation recipes, AI features, Track B sprints) is deliberately un-executed: report-class deliverables and account-dependent services, not quick wins.

## 2026-07-27 — Track A quick wins (completed, verified in-browser)

| Decision | Rationale | Rejected alternative |
|---|---|---|
| `og-cover` ships as **JPEG q82** (82KB), PNG deleted, meta updated | Measured: PNG8 quantize = 379KB vs JPEG = 82KB on gradient-heavy art; JPEG is universally scraper-safe | PNG8 (4.6× heavier); WebP (unreliable in WhatsApp/FB scrapers) |
| Profile photo = **`PROFILL.webp` 380×570 (16KB)** + resized `PROFILL.PNG` (143KB) as `onerror` fallback | 2× the 190×220 rendered box; WebP support is universal in browsers, PNG covers pathological cases | Overwriting PNG only (9× heavier than WebP); pre-cropping to 380×440 (saves ~3KB, deferred as informational) |
| Removed **sparkle canvas, `#grain` overlay, custom cursor** end-to-end (DOM+CSS+JS) | Operator mandate; two always-running rAF loops and a mix-blend cursor were pure overhead | — (kept `#tex-paper`/`#tex-noise` static textures and orbital canvas: designed identity, not noise) |
| Mobile nav = **hamburger ≤840px**, glass slide-down panel inside `<nav>`; boundary pair 840px/**840.02px** in CSS and JS | 6 links + controls overflow below ~800px; .02px pair closes the fractional-width gap at zoom/125% DPI scaling | 841px integer pair (leaves (840,841) uncovered); separate fullscreen menu overlay (overweight for 7 items) |
| Socials = **LinkedIn → GitHub → Instagram**; Discord removed | Recruiter-facing ordering; Discord alias handle (`lyanvereaux`) reads unprofessional | Removing Instagram too — kept (same handle as LinkedIn, harmless); revisit on request |
| Typewriter starts **`load`+900ms, 28ms/char** | Old code double-waited 2×2600ms → text at ~5.2s; anchoring to `load` keeps typing visible after the loader fade instead of racing it | Parse-time +900ms (plays hidden behind loader on slow networks) |
| Removed `#theme-toggle svg { display:block }` | ID+type specificity (1,0,1) beat the icon show/hide rules (0,2,1) → both sun and moon rendered simultaneously in every theme | Raising icon-rule specificity (adds noise; deletion was sufficient) |
| Reduced-motion block now also zeroes `animation-delay` + `transition-delay` | Delays survived the duration kill: 2.3s invisible hero cards and a 300ms focusable-but-invisible menu window under reduced motion | Per-component gating (violates single-gate invariant) |
| `-webkit-backdrop-filter` added to `.nav-scrolled` and `nav.nav-open` | Safari ≤17 requires the prefix; unprefixed-only = unblurred bar seam on iOS | — |

**Measured after change (lab: localhost, unthrottled Chromium):** LCP 736ms (budget <2500), CLS 0.0014 (budget <0.1), 0 console errors. Image payload −2.3MB. Field numbers on throttled hardware not yet taken.

## Open advisories (not yet executed — priority order)

1. **Hero stats + CTA rows clip at 375px** — third stat and "Get in Touch" cut off; needs `flex-wrap` + tighter gap (pre-existing, outside Track A).
2. **~30KB base64 ID-card JPEG inline in `index.html`** — sits on the critical path; extract to a file (or reuse a resized asset).
3. **Four font families load from Google Fonts** (Inter, Source Code Pro, DM Serif Display, Playfair Display — Playfair appears unused); biggest remaining LCP risk on real networks.
4. PROFILL.webp carries ~23% extra rows vs its cover-crop; a 380×440 pre-crop is a marginal win.
