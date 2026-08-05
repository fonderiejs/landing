# Fonderie — Landing Page

The marketing site for [Fonderie](https://fonderiejs.com), the open foundry for AI-built SaaS. A static site with no build step: plain HTML, CSS, and vanilla JavaScript.

## Pages

| File | URL | Purpose |
| --- | --- | --- |
| `index.html` | `/` | Home page |
| `contact.html` | `/contact` | Contact |
| `404.html` | (any unmatched path) | Error page, served directly by `serve.mjs` |

Pages are served with clean URLs (`/contact`, not `/contact.html`).

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
  css/        home.css — orange/blueprint stage design (tokens, reveal, theme
              switcher). Shared by every page.
  img/        favicon, OG image, hero art
  js/         home.js — theme switcher, copy button, scroll reveal
404.html
contact.html
index.html
manifest.json   PWA manifest
serve.mjs       local dev server
CNAME           custom domain for GitHub Pages (fonderiejs.com)
```

Theme preference (System/Light/Dark) is stored in `localStorage` and applied via a `data-theme` attribute on `<html>`.

## Deployment

The site deploys as-is — every file in the repo is served directly. GitHub Pages uses the `CNAME` file to bind the `fonderiejs.com` domain. No build or bundling step is needed; push to `main` to publish.

## Conventions

- Keep the site dependency-free: no frameworks, no package.json.
- When adding a page, create `<name>.html` at the root, link `home.css`/`home.js`, and link to it with its clean URL (`/<name>`).
- All pages share one design system (`home.css`/`home.js`) — the nav/footer chrome in `index.html`, `contact.html`, and `404.html` is copied verbatim between them, so keep new pages consistent with that shell.
