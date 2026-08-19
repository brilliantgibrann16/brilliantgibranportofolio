# Concept Brief — Portfolio v2.0

## The three directions considered

**1. SYS.GIBRAN — the Personal Operating System.** Evolve the Finder into a full OS: menu bar, dock, draggable windows, a working terminal (`help`, `projects`, `sudo hire-me`). Visual language: hyperreal desktop skeuomorphism. Motion signature: window physics. **Named risk:** crowded prior art — OS-portfolios exist and are well known; the concept flexes effort, not originality.

**2. BUKTI — the Evidence Dossier.** The portfolio as a forensic case file: every claim carries chain-of-custody (credential IDs, verification links, stamped artifacts). Visual language: technical dossier / Swiss editorial, redaction-bar reveals. Motion signature: stamps landing, seals breaking. **Named risk:** the site currently owns few linkable artifacts — the concept rings hollow until repos and reports are public; fabricating links is forbidden.

**3. OPEN ANATOMY — the Self-Documenting Site.** The portfolio's flagship project is *itself*, and it can prove it: press **X** and the site dissects itself live — the 8px grid materializes, sections annotate themselves with their real design tokens, a HUD streams actual FPS/LCP/CLS/DOM counts, and hovering any component reveals what it is and what it's built from. The flex is inherent: the mechanism that shows off the craft *is* the craft. **Named risk:** engineering-heavy; if the inspector itself drops frames, the concept self-destructs.

## Selected: OPEN ANATOMY (with BUKTI's evidence structure grafted into the project panels)

**Emotional intent, one sentence:** the visitor should feel like they caught a craftsman leaving the workshop door open — and everything inside is exactly as clean as the storefront.

**Why this direction, defended on intent:** directions 1 and 2 *tell* the visitor the owner is skilled. Only 3 lets a recruiter *catch him being skilled* — unstaged, inspectable, live. It is the only direction where zero content can be faked (the HUD reads real numbers or nothing), which converts the site's biggest audit weakness (asserted-not-shown skill, COPY-02/03) into its signature. And it composes with everything worth preserving: the Finder stays, the dark-minimal brand stays, the zero-dependency stack becomes part of the exhibit.

**Visual language:** the owner's stated identity — dark-first, minimalist, professional — tightened. Dark is now the canonical theme (light preserved as secondary). X-ray layer: hairline 1px annotations, Source Code Pro micro-labels, single accent `#1e9fff`, blueprint-style measurement ticks. No new decoration anywhere; the x-ray only draws information.

**Motion signature:** instrument-like — overlays draw in with 150–250ms expo-out reveals, annotations typeset on like measurement callouts. Nothing bounces. Reduced-motion collapses the x-ray to instant static overlays.

**Signature moment:** pressing `X` (or the nav scope button). The site holds still; the anatomy surfaces around it.

**Palette:** `#111113` bg · `#1c1c1e` card · `#f0f0f0` primary · `#a0a0a8` secondary · `#1e9fff` accent · `#a5f3fc` accent-2 · light theme retained as inversion with corrected contrast tokens.

**The one thing this build refuses to do:** invent evidence. No fabricated repo links, no imaginary metrics, no fake testimonials. Every number on the site is real or absent; project artifacts not yet public say so plainly and offer a request path.

## Declined-alternatives ledger
- SYS.GIBRAN declined for prior-art density — one line saved for a future terminal easter egg inside x-ray mode.
- BUKTI declined as the *lead* concept (artifact shortage) but its evidence-slot structure ships now inside every project panel, ready to receive real links as they become public.
