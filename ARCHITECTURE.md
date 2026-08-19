# Architecture — brilliantgibranportofolio.my.id

Single-file static portfolio. No build step, no framework, no dependencies, **zero external requests** (fonts self-hosted in `/fonts`). Deployed on Vercel. Concept: **OPEN ANATOMY** (see CONCEPT.md) — press `X` (or the nav scope button, or `?xray=1`) and the site dissects itself: grid rails, per-section anatomy tags, live FPS/LCP/CLS/DOM/transfer HUD, hover token inspector. X-ray code is `.xr-`-prefixed CSS at the end of the style block + `window.XRAY` IIFE at the end of the script block; ≥840px pointer devices only; zero work while off. Dark is the canonical theme (light = explicit choice). New files since the D0 inventory: `404.html`, `id-photo.jpg`, `CONCEPT.md`, `fonts/` (inter-var, scp-var, dmserif-400 + italic — variable fonts, latin subsets). `noise-texture.png` deleted (inline SVG turbulence replaced it). All JS motion gates on the shared `REDUCED` const; project panels deep-link as `#p-<id>`.

## File inventory

| File | Role |
|---|---|
| `index.html` | Entire application: styles, markup, scripts inline (~169KB) |
| `PROFILL.webp` | About-section polaroid photo, 380×570, 16KB (primary) |
| `PROFILL.PNG` | Same image, PNG fallback via `onerror`, 143KB |
| `og-cover.jpg` | Social share card, 1200×630, 82KB (`og:image` / `twitter:image`) |
| `paper-texture.jpg`, `noise-texture.png` | Fixed texture overlays (`#tex-paper`, `#tex-noise`), injected by JS |
| `CV BRILLIANT.pdf` | Download target of the hero CTA |
| `vercel.json` | Security headers: CSP, XFO, nosniff, Referrer-Policy, Permissions-Policy |
| `robots.txt`, `sitemap.xml` | SEO plumbing |

## index.html internal structure

**`<style>` (one block, ordered):** reset → theme tokens (`:root` / `html.dark` custom properties) → texture overlays → keyframes → reveal system (`.wr` variants: rise/lift3d/clip/slide/pop/fade + delay utilities) → loading screen → nav (+ mobile nav at the `── MOBILE NAV ──` marker) → hero grid → per-section styles (about/projects-finder/experience/certifications/skills/contact-form) → dark-mode overrides → responsive blocks (`840.02px`/`840px` nav pair, `900px` layout collapse, `600px` type scale).

**DOM order:** `#loading` overlay → `<nav>` (logo · `.nav-links` [6 anchors, `#theme-toggle`, `.nav-hire`, `#nav-burger`] · `#mobile-menu` panel) → `#hero` (orbital canvas, status pill, split-letter name, typewriter tagline, stats, CTA row, stack card, ID-card badge) → `#about` (polaroid + bio) → `#projects` (macOS-Finder metaphor, JS-driven detail panel) → `#experience` → `#certifications` → `#skills` → `#contact` (Formspree form + socials) → footer.

**`<script>` (one block, IIFE modules):** theme init/toggle → loader dismiss (`load` event) → nav glass on scroll → mobile nav controller → orbital canvas (rAF) → typewriter (starts `load`+900ms, 28ms/char) → magnetic buttons → `.wr` bidirectional scroll reveal → word-wave section labels → one-shot `.reveal` observer → stat counters → texture injection → project data + open/close/filter → contact form fetch handler → scroll progress bar → hero parallax → 3D card tilt → ripple → chip stagger → contact-heading char split → nav-logo glitch data-text → hero name letter split → experience stagger/tilt → social magnetic lift.

## Invariants

- Theme = `html.dark` class + CSS custom properties; every new color must use an existing token or add one — no hardcoded pairs outside the dark-override section.
- Mobile nav breakpoint is **840px / 840.02px** and must stay in sync in three places: two media queries and the `matchMedia` listener in the mobile-nav IIFE.
- Reduced motion is gated once, globally (`prefers-reduced-motion` block neutralizes duration **and** delay). Do not add per-component gates.
- Animations run on transform/opacity only; canvases are the only rAF consumers (orbital).
- CSP in `vercel.json` allows: self, inline style/script, Google Fonts, Formspree, `data:` images. Any new external origin requires a CSP update in the same change.
