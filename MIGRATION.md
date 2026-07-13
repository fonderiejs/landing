# Landing Page Migration (myotto.ai → proprietary theme)

Mirrors the approach used in `platform/ui` (TokenWiz Bootstrap → BEM migration).

## Source

Fresh wget mirror of https://myotto.ai (Next.js 15 / Turbopack static export,
Tailwind v4, deployment `dpl_Frrbfnq3LRJkzKKYFWDCX3e1pNik`) kept in
`platform/myotto.ai-mirror/`.

## Phase 1 — Audit & strip ✅

- Removed all 34 scripts: Next.js/Turbopack runtime chunks, inline RSC payloads,
  Google Tag Manager, Meta Pixel. Removed preload hints, `data-dpl-id`,
  `next-size-adjust`, and the third-party chat widget (JS-loaded, gone with it).
- Removed inline `style="opacity:0;transform:translateY(6px)"` scroll-reveal
  seeds — without React they left sections permanently invisible.
- Renamed hashed assets: `favicon.ico`, `icon.svg`, `icon.png`, `apple-icon.png`.
- Copied the compiled Tailwind chunk to `styles.css`; copied the 7 Inter woff2
  subsets to `fonts/` and rewrote `@font-face` URLs.
- Pretty-printed `index.html` (was one 82KB minified line).
- Kept all SEO metadata (OG, Twitter, manifest, JSON-LD was script-borne and dropped).

## Phase 2 — Token extraction ✅

`base.css` created with `@layer reset, base, layout, components, utilities`:

- **Fonts**: 29 per-weight `@font-face` rules collapsed to 7 variable-weight
  (`font-weight: 300 600`) unicode-range subsets + Arial-based "Inter Fallback".
- **Tokens** under `:root`: light palette (`--color-background:#fafafa`,
  `--color-foreground:#171717`, `--color-muted:#5c5c5c`, borders `#e0e0e0`/`#d4d4d4`,
  emerald accents), dark presale palette (`--dark-*`), type scale
  (`--text-body-sm/md/lg`, hero 38/54px), tracking (display -0.05em, body -0.02em),
  spacing unit 0.25rem, container 65rem, radii, `--shadow-button`, easings.
- `base.css` is linked before `styles.css`; values are identical so rendering is
  unchanged until phase 3 swaps the Tailwind utilities for BEM components.

## Phase 3 — Component conversion ✅

- `theme.css` created (layout + components layers): `.page`/`.container`,
  `.nav`, `.hero` (spectrum gradient + perspective grids moved from inline
  styles into CSS), `.features`/`.feature` with `__deco` mask variants,
  `.model-row`, `.conn`, `.id-card`, `.spend-card`, `.duo`, `.notif-stack`,
  `.device-tile`, `.footer`, plus atoms `.btn`, `.arrow-btn`, `.tag`, `.dot`.
- `index.html` fully rewritten with BEM classes; zero Tailwind utilities and
  zero inline styles remain. The `reveal-load` entrance animation is kept in
  CSS with a `prefers-reduced-motion` opt-out.
- `styles.css` (compiled Tailwind) is no longer linked — kept on disk only as
  a reference; safe to delete once QA'd.
- See `MIGRATION-CLASS-MAP.md` for the full before/after mapping.

## Phase 4 — Minimal JS ✅

`landing.js` (~20 lines, no dependencies): toggles `.nav--open` on the burger,
which shows `.nav__menu` (mobile-only dropdown, scoped under a max-width query
— no `!important`) and morphs the burger into an ×. Menu closes on link tap
and when the viewport crosses the md breakpoint. `aria-expanded` is kept in
sync. Loaded with `defer`.

## Shared design system with platform/ui

Both themes now share typography and palette:

- **Font**: Inter everywhere (`platform/ui` references `../landing/fonts/`);
  tracking tokens `--tracking-display:-0.05em`, `--tracking-body:-0.02em`.
- **Light**: bg `#fafafa`, surface `#fff`, text `#171717`, muted `#5c5c5c`,
  borders `#e0e0e0`/`#d4d4d4`. **Dark**: bg `#0a0a0a`, surface `#111`,
  text `#ededed`, muted `#a1a1aa`, borders `#27272a`/`#3f3f46`.
  Accent: emerald `#00d294`/`#009767` (replaces ui's old blue).
- **Day/night**: automatic via `prefers-color-scheme` in both, plus the shared
  footer theme switcher (System / Light / Dark). "System" clears the
  `data-theme` override so the OS preference rules; Light/Dark persist to
  `localStorage` and a pre-paint head snippet applies them without FOUC.
  Component surfaces in `theme.css` use `--color-surface(-hover)` and
  `color-mix()` translucency so dark mode reaches every element; the spend
  card and device tile stay dark by design in both modes.

## Rebrand — Otto → Fonderie ✅

- All naming, metadata, OG/Twitter tags, and URLs swapped to
  Fonderie / fonderiejs.com / Fonderie, Inc.
- Text wordmark ("fonderie") in the nav; "F" monogram in a rounded square
  (`currentColor` + `var(--color-background)`, dark-mode aware) replaces the
  Otto marks everywhere. `icon.svg` monogram favicon + minimal
  `manifest.json` replace Otto's image icons.

## Copy — sell the foundry ✅

Positioning per the brand decisions (see memory: enemy-first, identity-driven,
price-by-contrast, Vercel-grade terseness):

- Hero: "Stop renting your own software." — enemy leads; share metas carry it.
- Cards: Core (open source), Gateway, Connectors, Identity, Spend — each ends
  on who the buyer becomes; Spend anchors price against the seat it replaces.
- Duo: "One cockpit for it all." / "Proof, not promises." (crewfinding is the
  unnamed first casting — client deliverable, never named as a feature).
- All copy cut ~50% for terseness; headlines untouched.

## Divergence from myotto.ai ✅

- Hero: molten ember/emerald glow (`.hero__melt`) replaces Otto's rainbow
  spectrum + dual 3D perspective grids.
- Staged data is Fonderie-true: casting pipeline rows (crewfinding /
  casting-02 / casting-03), dispatcher identity, FONDERIE •••• 2140 at
  $86.20/$400, builder-stack connectors (Stripe/Postgres in), notification
  "casting-02 · poured".
- Section rhythm: two 3-card grids (intro/Core/Gateway, Connectors/Identity/
  Spend) with the 50/50 cockpit-proof duo band between them. Cards size to
  content at the original 320/300px baselines.

## Multi-page site ✅

- Pages: `/` plus `platform`, `products`, `help`, `contact` — shared
  nav/footer, `.subhero` component, anchored deep links
  (`/platform#core` …). Privacy/Terms links dropped until legal text exists.
- Clean URLs: all internal links extensionless. `serve.mjs` (zero-dependency
  Node) resolves `/platform` → `platform.html` for local review — matches
  `cleanUrls: true` on Vercel / automatic on Cloudflare Pages /
  `try_files $uri $uri.html` on nginx. Site requires a server; `file://`
  navigation no longer works.
- Footer bottom row: copyright left, theme switcher right (stacked centered
  on mobile).

## Proof surface — SDK live on npm ✅ (2026-07-11)

- All 17 SDK packages published under the **@fonderie** scope
  (core/client/store/logger at 0.1.0, the rest at 1.0.0); release tags on
  [fonderie-js/sdk](https://github.com/fonderie-js/sdk). The GitHub org stays
  `fonderie-js`; the npm scope is `@fonderie` (`fonderie-js` on npm is a
  defensive registration).
- Landing hero and `/platform` Core card carry a verified
  `$ npm install @fonderie/core` pill; `/products` links the repo; footer has
  GitHub + X icons. Every "Open source" claim on the site is now checkable.
- The public SDK repo history was purged of `examples/` (client code) via
  git-filter-repo before the first push.

## Remaining

- `styles.css` deleted after QA — the site runs entirely on `base.css` + `theme.css`.
- Legal text for Privacy/Terms pages, then restore the footer links.
- `hello@fonderiejs.com` mailbox must exist before publishing `contact`.
- The site itself is not yet deployed (npm/GitHub are public; fonderiejs.com is not).
