# Fonderie — Landing Page

The marketing site for [Fonderie](https://fonderiejs.com), the open foundry for AI-built SaaS. A static site with no build step: plain HTML, CSS, and vanilla JavaScript.

## Pages

| File | URL | Purpose |
| --- | --- | --- |
| `index.html` | `/` | Home page |
| `platform.html` | `/platform` | Platform overview |
| `products.html` | `/products` | Products overview |
| `help.html` | `/help` | Help / FAQ |
| `contact.html` | `/contact` | Contact |
| `blog/index.html` | `/blog` | Blog index |
| `blog/<slug>.html` | `/blog/<slug>` | Blog posts (one file per post) |

Pages are served with clean URLs (`/platform`, not `/platform.html`).

## Local development

Requires Node.js (no dependencies to install):

```sh
node serve.mjs        # http://localhost:8080
node serve.mjs 3000   # custom port
```

`serve.mjs` is a tiny dev server that resolves clean URLs to their `.html` files, matching how the site is served in production.

## Structure

```
assets/
  css/        base.css and theme.css (light/dark themes via data-theme)
  fonts/      self-hosted woff2 fonts
  img/        logo lockups and favicon
  js/         landing.js (theme toggle and page interactions)
contact.html
help.html
index.html
platform.html
products.html
manifest.json   PWA manifest
serve.mjs       local dev server
vercel.json     clean URLs + font caching headers
CNAME           custom domain for GitHub Pages (fonderiejs.com)
```

Theme preference is stored in `localStorage` and applied via a `data-theme` attribute on `<html>` before first paint to avoid a flash of the wrong theme.

## Deployment

The site deploys as-is — every file in the repo is served directly:

- **GitHub Pages** uses the `CNAME` file to bind the `fonderiejs.com` domain.
- **Vercel** (or compatible hosts) reads `vercel.json` for clean URLs and long-lived cache headers on fonts.

No build or bundling step is needed; push to `main` to publish.

## Conventions

- Keep the site dependency-free: no frameworks, no package.json.
- Fonts are cached immutably (`vercel.json`), so add new font files under new names rather than replacing existing ones.
- When adding a page, create `<name>.html` at the root and link to it with its clean URL (`/<name>`).

See `MIGRATION.md` and `MIGRATION-CLASS-MAP.md` for notes from the original site migration.
