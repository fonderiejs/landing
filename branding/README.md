```
███████╗ ██████╗ ███╗   ██╗██████╗ ███████╗██████╗ ██╗███████╗
██╔════╝██╔═══██╗████╗  ██║██╔══██╗██╔════╝██╔══██╗██║██╔════╝
█████╗  ██║   ██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝██║█████╗
██╔══╝  ██║   ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗██║██╔══╝
██║     ╚██████╔╝██║ ╚████║██████╔╝███████╗██║  ██║██║███████╗
╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝
```

# Fonderie brand

Assets and guidelines for [Fonderie](https://fonderiejs.com) — the open
foundry for casting SaaS you own.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="export/x-banner.png">
  <img alt="Stop renting your own software — npm install @fonderie/core" src="export/x-banner-light.png">
</picture>

<p>
  <img alt="Monogram, dark tile (primary)" src="export/x-avatar.png" width="96">
  &nbsp;
  <img alt="Monogram, light tile" src="export/x-avatar-light.png" width="96">
</p>


## Wordmark & monogram

- Wordmark: **fonderie**, always lowercase, set in Inter Semibold with
  display tracking (−0.05em).
- Monogram: the block **F** in a rounded square. Dark tile (`#171717`,
  radius 25%) with the F in `#fafafa` is the primary mark and works on any
  background — use it for avatars everywhere. The light tile is for
  print-like contexts only.

## Color

Two schemes, same system — identical to the tokens shipped on
[fonderiejs.com](https://fonderiejs.com).

| Token | Light | Dark |
|---|---|---|
| Background | `#fafafa` | `#0a0a0a` |
| Surface | `#ffffff` | `#111111` |
| Foreground / text | `#171717` | `#ededed` |
| Muted text | `#5c5c5c` | `#a1a1aa` |
| Border | `#e0e0e0` | `#27272a` |
| Border strong | `#d4d4d4` | `#3f3f46` |
| Emerald (accent) | `#00d294` / `#009767` | `#00d294` / `#00e6a2` |
| Ember (melt glow only) | `#ff9d47` | `#ff9d47` |

The **melt** — a radial ember-to-emerald glow rising from the bottom
edge — is the one decorative motif. Ember never appears as a UI color;
it exists only inside the melt.

## Typography

- **Inter** (300–600), tracking −0.05em for display sizes, −0.02em for
  body. The latin subset used to render these assets is in
  `src/inter-latin.woff2` — the same file fonderiejs.com serves.
- Code and terminal lines: Menlo / system monospace.

## Assets (`export/`)

| File | Size | Use |
|---|---|---|
| `x-avatar.png` / `x-avatar-light.png` | 800×800 | Profile pictures (dark is primary) |
| `x-banner.png` / `x-banner-light.png` | 1500×500 | Headers with the tagline — fixed-crop platforms only |
| `banner-plain.png` / `banner-plain-light.png` | 1500×500 | Text-free melt — safe for platforms that crop unpredictably |

## Rebuilding

Assets render deterministically from the HTML sources in `src/` with
headless Chrome:

```sh
chrome --headless --screenshot=export/x-banner.png \
  --window-size=1500,500 --hide-scrollbars src/banner.html
```

## Usage

Fine: using these assets to reference, link to, or write about Fonderie.
Not fine: altering the marks, recoloring them, or using them to imply
affiliation or endorsement. When in doubt: hello@fonderiejs.com.
