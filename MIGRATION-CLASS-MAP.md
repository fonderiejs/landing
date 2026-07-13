# Migration Class Map

Tailwind utility clusters → BEM components (`theme.css`). One row per original
element role; the utility soup shown is abridged to its distinguishing classes.

## Layout

| Original (Tailwind) | New BEM |
|---|---|
| `min-h-screen w-full bg-background font-sans flex flex-col` | `.page` |
| `max-w-260 mx-auto md:border-x border-border flex-1 …` | `.container` |

## Nav

| Original | New BEM |
|---|---|
| `sticky top-0 z-50 border-b bg-background/70 backdrop-blur-md` | `.nav` |
| `h-13 flex items-center px-6 md:px-8 gap-6` | `.nav__inner` |
| logo `<a class="flex items-center">` | `.nav__logo` |
| `hidden md:flex items-center gap-6` (links) | `.nav__links` |
| `text-body-sm text-muted hover:text-foreground …` | `.nav__link` |
| `hidden md:flex ml-auto …` (CTA slot) | `.nav__actions` |
| `md:hidden ml-auto flex …` | `.nav__mobile` |
| hamburger `size-8 flex flex-col …` + 3 spans | `.nav__burger` |

## Buttons & atoms

| Original | New BEM |
|---|---|
| `px-5 py-2.5 bg-foreground text-white rounded-full text-[13px] …` | `.btn` |
| `px-4 py-1.5 … shadow-button` (nav CTA) | `.btn.btn--nav` |
| `w-10 h-10 rounded-full border-border-strong bg-white shadow-button …` | `.arrow-btn` |
| `w-fit text-[10px] uppercase tracking-[0.08em] border rounded-full px-2.5 py-1` | `.tag` |
| `size-1.5 rounded-full bg-emerald-400` / `bg-border-strong` | `.dot.dot--on` / `.dot` |

## Hero

| Original | New BEM |
|---|---|
| `relative overflow-hidden border-b py-20 md:py-28 …` | `.hero` |
| inline rainbow-gradient div | `.hero__spectrum` — **removed** in the divergence pass |
| inline perspective-grid divs (top/bottom) | `.hero__grid--top` / `--bottom` — **removed**; both replaced by `.hero__melt` (molten glow) |
| `reveal-load relative z-10 flex flex-col items-center gap-6` | `.hero__content` |
| logo mark svg `w-11 h-auto text-foreground` | `.hero__mark` |
| `text-[38px] md:text-[54px] font-semibold tracking-display max-w-180` | `.hero__title` |
| `text-body-md md:text-body-lg text-muted max-w-120 …` | `.hero__lede` |

## Feature grid

| Original | New BEM |
|---|---|
| `reveal-load grid grid-cols-1 md:grid-cols-3 border-b` | `.features` |
| `relative overflow-hidden border-b p-8 md:p-10 min-h-80 …` | `.feature` |
| `md:border-r` | `.feature--divide` |
| `md:border-b-0` (row 2) | `.features .feature:nth-child(n+4)` rule |
| `relative z-10 flex flex-col gap-3` | `.feature__body` |
| `gap-4` intro variant | `.feature__body--intro` |
| `text-[22px] font-semibold tracking-display …` | `.feature__title` |
| `text-[30px] md:text-[34px] …` | `.feature__title--lead` |
| `text-body-sm text-muted leading-[1.65] …` | `.feature__text` |
| `text-body-md …` | `.feature__text--lead` |
| bottom-pinned deco wrappers (`absolute inset-x-0 bottom-0` + masks) | `.feature__deco` + `--pad` / `--fade-40` / `--fade-45` / `--fade-55` |
| `font-mono text-[12px] leading-[2.1] text-[#ccc]` | `.filetree` |
| model rows (`flex justify-between border-t bg-background px-8 py-3`) | `.model-row`, `__id`, `__name`, `__kind` |
| connector chips grid | `.conn-grid`, `.conn`, `.conn__name` |
| identity card (`rounded-xl bg-white shadow-…`) | `.id-card`, `__head`, `__avatar`, `__name`, `__status`, `__rule`, `__row`, `__value` |
| spend card (`rounded-2xl bg-[#1a1a1a] …`) | `.spend-card`, `__head`, `__number`, `__meter`, `__amounts`, `__spent`, `__limit`, `__track`, `__fill` |

## Duo row

| Original | New BEM |
|---|---|
| `grid grid-cols-1 md:grid-cols-3 border-b` | `.duo` |
| left panel `min-h-75 …` | `.duo__panel` |
| right panel `md:col-span-2 sm:flex-row …` | `.duo__panel--wide` |
| notification stack + masks | `.notif-stack`, `.notif`, `__icon`, `__content`, `__meta`, `__app`, `__time`, `__body`, `.notif-stack__ghost(--far)` |
| `size-40 md:size-50 bg-[#1a1a1a] rounded-3xl …` | `.device-tile` |
| `max-w-70` | `.duo__text--narrow` |

## Footer

| Original | New BEM |
|---|---|
| `mt-auto px-8 py-10` | `.footer` |
| `grid grid-cols-2 md:grid-cols-4 gap-8` | `.footer__grid` |
| `flex flex-col gap-3` | `.footer__col` |
| `text-[10px] uppercase tracking-widest …` | `.footer__heading` |
| `text-body-sm text-muted hover:text-foreground …` | `.footer__link` |
| `mt-10 text-[11px] text-center …` | `.footer__copy` |

## Post-migration additions

Components added after the Tailwind→BEM conversion; these have no Otto
original — they are Fonderie's own.

| Component | Purpose |
|---|---|
| `.hero__melt` | Molten ember/emerald glow at the hero's bottom edge; replaces `.hero__spectrum` and both `.hero__grid` variants |
| `.nav__wordmark` | Text wordmark ("fonderie") replacing the Otto logo SVG |
| `.nav__menu` | Mobile dropdown menu (burger-toggled via `.nav--open`) |
| `.subhero`, `.subhero__title` | Smaller hero for the subpages (`/platform`, `/products`, `/help`, `/contact`) |
| `.footer__bottom` | Footer bottom row: copyright left, theme switcher right (stacked centered on mobile) |
| `.theme-switch`, `__option` | System/Light/Dark segmented radio pill, ported from `platform/ui`; persists to `localStorage` as `data-theme` |
