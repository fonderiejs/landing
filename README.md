# Fonderie — Landing Page

The site for [Fonderie](https://fonderiejs.com), the standard for end-to-end AI-built SaaS. Next.js 16 (App Router), statically exported, deployed to GitHub Pages. Six locales via [next-intl](https://next-intl.dev).

The home page speaks to founders: what they get, by when, and that they own it. Prices are on `/pricing` only. Technical detail lives on GitHub, not here.

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

**Status:** English is the source of truth. The other five locales have the same JSON structure and keys. Their copy for the founder page (`common.json`, `home.json`, `pricing.json`) was translated when the page was rebuilt in November 2026 and has not yet been read by a native speaker of each language; `contact.json` and `security.json` are the earlier translations.

### Adding a new locale

1. Add the locale code to `locales` in `lib/i18n.ts` and give it a display name in `localeNames`.
2. Create `messages/<locale>/` with the same five JSON files as `messages/en/` (`common.json`, `home.json`, `pricing.json`, `contact.json`, `security.json`).
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
  styles/                 # Tailwind's entry and the components' sheets (see "Styles")
    tailwind.css           # the entry every page loads: reset, utilities, theme, and shared.css
    shared.css             # components every page carries: frame, bar and menus, seat form, footer, controls
    home.css               # the home page's components, loaded by that page only
    pricing.css            # the pricing page's
    pages.css              # the contact and security pages'
  [locale]/
    layout.tsx             # <html lang>, fonts, metadata, structured data; the bar, the footer and the seat form for every page
    page.tsx                # the founder page: composes the sections
    pricing/page.tsx        # the one page that shows prices
    contact/page.tsx
    security/page.tsx
    not-found.tsx           # 404
    sections/                # Top (hero, "Your idea" card, five commitments), Band, Steps, Cast, Questions, Parts, RunIt
                             # and their moving parts: TopFrame, IdeaDemo, StepsNav, Scene, NotesDemo, CastPrompt, Strip, Bars;
                             # motion.ts holds the timing tools the two timed pictures share
    components/              # Header, Footer, Logo, SeatProvider, SeatButton, LocaleSwitcher, ThemeSwitcher
lib/
  i18n.ts                    # next-intl request config + locale list
  navigation.ts               # next-intl Link/router wrappers (locale-aware, no middleware)
  site.ts                     # addresses, outside links and the seat form's settings
messages/
  en/*.json                  # source of truth: common, home, pricing, contact, security
  de/ fr/ pt-BR/ ja/ zh/*.json  # same keys, translated
public/
  images/                     # share images, icon, the sky behind the hero, the editor picture, marks and icons
  CNAME                       # custom-domain binding; must live in public/ so it's copied into out/
```

## Styles

Tailwind CSS v4 for the reset, the theme and the utilities; components written in BEM for every part with a look of its own.

**Where the rules are.** `app/styles/tailwind.css` is the entry every page loads: Tailwind's reset and utilities, the theme, and `shared.css`. The home, pricing, contact and security pages each import a sheet of their own, so no page downloads another page's rules. The not-found page has none: Next.js keeps that page ready inside every other one, so a sheet of its own would be fetched by all of them. Its few rules are in `shared.css`.

**Who does what.**

- **A part with a look of its own is a component**, named `f-block__element--modifier`. Its rule holds everything about it: sizes, type, colours, states, pseudo-elements, motion.
- **An element that only arranges what it contains** (a row, a grid, a centred column, a gap) **has no name and no rule.** It takes utilities in the markup, such as `max-w-7xl mx-auto px-4 md:px-10`.
- **An element is one or the other.** Components sit in Tailwind's `components` layer, so a utility added to a component's element wins over its rule at every width and in every state.
- Seven names have no rule and stay in the markup. Four are read by the components' own scripts (`f-idea__typed`, `f-idea__scroll`, `f-notes__scroll`, `f-notes__ask`). Three are handles for tests and for reading the markup: the roots of two blocks (`f-notes`, `f-strip`) and the button that opens a menu (`f-nav__trigger`).

**Why utilities stop there.** Next.js writes every class name twice in a page: once in the markup, once in the data the page starts from. A declaration therefore costs more as a utility than inside a rule. Measured on the home page, compressed: giving utilities to every element that could take them saved about 0.2 KB of CSS and added about 2.7 KB of HTML. Weigh that before spreading utilities over a component.

**The theme** (`tailwind.css`), in two parts.

- `@theme` holds what only utilities are built from. Lengths are in pixels, as the page was drawn: one spacing step is 4px (`p-4` is 16px); the breakpoints are `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536, `3xl` 1920. Tailwind writes out the ones in use.
- `@theme static` holds what the components read too, and writes all of it out, because Tailwind does not see the pages' own sheets read them.
  - Colours: `ink`, `ground`, `paper`, `line`, `accent`, `button` and the others for the founder page; `old-*` for the contact, security and not-found pages. The dark theme redefines them under `[data-theme="dark"]`; `dark:` is the variant for it.
  - Fonts: `font-display` (Manrope), `font-sans` (Inter), `font-mono` (JetBrains Mono), `font-serif` (Instrument Serif).

**Where Tailwind looks for classes.** In `app/**/*.{ts,tsx}` only, never in the translated messages, where an ordinary word could be taken for a utility. One word of the scripts, `transform`, is excluded by name in `tailwind.css`: read as a class it would bring five registered variables with it.

**Browsers.** `browserslist` in `package.json` names the browsers the framework builds for: Chrome, Edge and Firefox 111, Safari and iOS Safari 16.4. The prefixer reads it, so a new rule gets the `-webkit-` forms Safari 16.4 to 17 need, and no prefix is written for a browser the site cannot run on. Tailwind 4 itself asks for Safari 16.4, Chrome 111 and Firefox 128.

## The seat form

Every "Reserve a seat" button is a plain email link underneath, so it works without JavaScript. What a click does depends on how the site was built (see `lib/site.ts`):

| Build | What the button does |
| --- | --- |
| `NEXT_PUBLIC_SEAT_ENDPOINT` is set | Opens the form. The address is posted to that service, under the field name in `NEXT_PUBLIC_SEAT_FIELD` (`email` by default), and the service sends the visitor the email that states the promise. |
| No endpoint, production build | Opens the visitor's mail program with a message asking for a seat. A published site must not show a form that sends nothing. |
| `npm run dev`, or `NEXT_PUBLIC_SEAT_PREVIEW=1` | Opens the form as a preview. Its confirmation says on the page that nothing was sent or saved. |

To connect a service, set the two variables in the `env` of the build step in `.github/workflows/deploy.yml`.

## Pictures and marks

- `cloud-hero.webp`, `hero-editor.svg`, `icon.svg`, `band/any.svg` and the share images (`og-image-*.png`) are Fonderie's own.
- **The favicon** is the mark from the brand set (`favicon-dark.svg` and `avatar-square-dark.svg`), in four files:
  - `images/icon.svg` is `favicon-dark.svg` as it stands: the F in the dot lattice on the orange rounded tile. Browsers that take a drawing use it.
  - `favicon-96x96.png` and `favicon.ico` (16, 32 and 48px) are that drawing as pictures, with clear corners. Safari before version 26 shows no SVG favicon, and every browser asks for `/favicon.ico` at the site's root on pages that name no icon (the 404 page, the bare `/`).
  - `apple-touch-icon.png` (180px) is `avatar-square-dark.svg`, square to the edges, because iOS rounds the corners itself.
  - When the mark changes, redraw all four from the brand folder; `app/[locale]/layout.tsx` and `public/manifest.json` name them.
- `band/*.svg`: [@lobehub/icons-static-svg](https://github.com/lobehub/lobe-icons) (MIT), recoloured. `tools/*.svg`: [simple-icons](https://simpleicons.org) (CC0). The marks belong to their owners and are shown only to name what the parts work with.
- `icons/*.svg`: [Phosphor](https://phosphoricons.com) (MIT).
- Drawings written into the components: [Lucide](https://lucide.dev) (ISC) for the small icons of the pictures and the prompt card (`circle-check-big`, `feather`, `list-checks`, `mail`, `pencil-line`, `users`, `user`, `user-plus`, `phone`, `paperclip`, `sliders-horizontal`); [Heroicons](https://heroicons.com) (MIT) for the sparkles on "Get me started"; simple-icons (CC0) for the GitHub mark in the footer.
- Fonts: Manrope, Inter and JetBrains Mono (all OFL), from Google Fonts.

## How the page moves

- **With the scroll.** The "Your idea" card settling as the first screen passes, the editor tucking in behind it, the headline sliding under the dark band and the lines filling under the step names are animations tied to scrolling, written in the style sheets (`animation-timeline`). A browser without them (Safari before 26, Firefox at the time of writing) shows those parts still: the card at its own size, no lines under the step names. Nothing else depends on it.
- **With the clock.** The "Your idea" card and the second step's window each play a fixed sequence (`IdeaDemo.tsx`, `NotesDemo.tsx`, timing tools in `motion.ts`); the prompt card types four requests in turn while it is in view (`CastPrompt.tsx`); the row of tools drifts while it is in view (`Strip.tsx`).
- **Reduced motion.** The timed pictures show their finished state and stay there, and the row of tools stands still.

## Sizes that are exact on purpose

The founder page is laid out to the pixel, on ordinary and on high-density screens, in Chrome and in Safari's engine. A few rules look odd and are deliberate:

- **Hairlines are `0.5px`.** A high-density screen draws them one device pixel thin; an ordinary one rounds them up to a whole pixel.
- **Width limits on the large titles are in `ch`** (`24ch`, `22ch`, `15ch`, `30ch`), not in pixels or `em`. A `ch` is measured on the font at its real size; an `em` figure worked out at one size is a fraction of a pixel off at another.
- **The block of five commitments has no width of its own below 1024.** It takes the width its widest line asks for (`width: fit-content`), so it also fits the other languages.
- **Below 768 the three steps keep to a 448px column**, and from 640 the buttons under "What you get" and "We run it" are as wide as their words.
- **Each name in the dark band sits in a cell of its own** (`.f-band__cell`). Without the cell, Safari and Chrome place a name that is wider than its column differently.
- **`cut()` in `Steps.tsx`** hands a trailing space over as a piece of text of its own. A browser measures and rounds each piece separately: with the space inside the piece before it, the bold words that follow sit 1/64 of a pixel away.

## Why no middleware, no image optimization, no API routes

GitHub Pages serves static files only — no Node runtime, no edge functions. Concretely:

- **No `middleware.ts`.** Locale detection/redirects normally run in middleware, but middleware needs a server. Locale routing here is fully resolved at build time via `generateStaticParams` on the `[locale]` segment. The root `/` is a plain prerendered page (`app/page.tsx`) that redirects to `/en` client-side — the only option available without a server to inspect `Accept-Language` or issue a real HTTP redirect.
- **`images.unoptimized: true` in `next.config.js`.** Next's image optimizer is a server feature; static export ships raw files from `public/` instead.
- **No `app/api/`.** Nothing here needs a backend. The seat form posts to an outside service when one is configured (see above).

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: `npm ci` → `npm run build` → upload `out/` as a Pages artifact → deploy via `actions/deploy-pages`.

- **Custom domain** (this repo's setup, see `public/CNAME` → `fonderiejs.com`): leave `basePath` unset in `next.config.js` (it defaults to `''`).
- **`username.github.io/repo-name` instead:** set `NEXT_BASE_PATH=/repo-name` in the workflow's `env` before the build step (commented out in `deploy.yml`, ready to uncomment).
