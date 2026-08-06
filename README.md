# Fonderie — Landing Page

The marketing site for [Fonderie](https://fonderiejs.com), the open standard for AI-built SaaS. Next.js 14 (App Router), statically exported, deployed to GitHub Pages. Six locales via [next-intl](https://next-intl.dev).

## Setup

```sh
npm install
npm run dev        # http://localhost:3000
```

## Build

```sh
npm run build       # outputs static files to out/
```

`next build` with `output: 'export'` in `next.config.js` produces a fully static `out/` directory — no server runtime, no API routes, no middleware. That's a hard requirement for GitHub Pages, which only serves static files.

## Locales

Six locales, every one of them prefixed (no middleware — GitHub Pages can't run one, so there's no way to serve un-prefixed English content at `/`):

| Locale | Path | Language |
| --- | --- | --- |
| `en` | `/en` | English (default) |
| `de` | `/de` | Deutsch |
| `fr` | `/fr` | Français |
| `pt-BR` | `/pt-BR` | Português (Brasil) |
| `ja` | `/ja` | 日本語 |
| `zh` | `/zh` | 中文 |

`/` itself is a static redirect page (`app/page.tsx`) that sends visitors to `/en`.

**Status:** English content is the source of truth, extracted verbatim from the original static site. The other five locales ship as professionally translated copy — same JSON structure and keys, native-language marketing copy (not machine-translated placeholders).

### Adding a new locale

1. Add the locale code to `locales` in `lib/i18n.ts` and give it a display name in `localeNames`.
2. Create `messages/<locale>/` with the same ten JSON files as `messages/en/` (`common.json`, `hero.json`, `problem.json`, `shift.json`, `solution.json`, `proof.json`, `packages.json`, `difference.json`, `pricing.json`, `contact.json`).
3. That's it — `generateStaticParams()` in `app/[locale]/layout.tsx` picks up the new locale automatically and pre-renders every page for it at build time.

### Adding a new translation key

1. Add the key to the relevant `messages/en/<section>.json` file.
2. Add the same key, translated, to every other locale's file — `next-intl` doesn't fall back to English for missing keys within a namespace, so a missing key will throw at build time for that locale.
3. Use it in a component with `useTranslations('<section>')` and `t('key')`.

## Structure

```
app/
  layout.tsx              # minimal root layout (Next.js requires one to exist)
  page.tsx                # "/" -> static redirect to "/en"
  globals.css
  [locale]/
    layout.tsx             # <html lang>, fonts, generateStaticParams, generateMetadata
    page.tsx                # composes all landing-page sections
    not-found.tsx           # localized 404
    contact/page.tsx
    sections/                # Hero, Problem, Shift, Solution, Proof, Packages, Difference, Pricing
    components/              # Navbar, Footer, LocaleSwitcher, MobileNav, PricingCard, PackageCard
components/
  ui/                       # CodeBlock (Shiki, server-rendered), StatCounter (client), CopyButton (client)
lib/
  i18n.ts                    # next-intl request config + locale list
  navigation.ts               # next-intl Link/router wrappers (locale-aware, no middleware)
  utils.ts                    # cn() class merge helper
messages/
  en/*.json                  # source of truth, one file per landing-page section
  de/ fr/ pt-BR/ ja/ zh/*.json  # same keys, translated
public/
  images/                     # og-image, favicon, hero art (served unoptimized — see below)
  CNAME                       # custom-domain binding; must live in public/ so it's copied into out/
```

## Why no middleware, no image optimization, no API routes

GitHub Pages serves static files only — no Node runtime, no edge functions. Concretely:

- **No `middleware.ts`.** Locale detection/redirects normally run in middleware, but middleware needs a server. Locale routing here is fully resolved at build time via `generateStaticParams` on the `[locale]` segment. The root `/` is a plain prerendered page (`app/page.tsx`) that redirects to `/en` client-side — the only option available without a server to inspect `Accept-Language` or issue a real HTTP redirect.
- **`images.unoptimized: true` in `next.config.js`.** Next's image optimizer is a server feature; static export ships raw files from `public/` instead.
- **No `app/api/`.** Nothing here needs a backend — it's marketing copy and a pricing table.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: `npm ci` → `npm run build` → upload `out/` as a Pages artifact → deploy via `actions/deploy-pages`.

- **Custom domain** (this repo's setup, see `public/CNAME` → `fonderiejs.com`): leave `basePath` unset in `next.config.js` (it defaults to `''`).
- **`username.github.io/repo-name` instead:** set `NEXT_BASE_PATH=/repo-name` in the workflow's `env` before the build step (commented out in `deploy.yml`, ready to uncomment).
