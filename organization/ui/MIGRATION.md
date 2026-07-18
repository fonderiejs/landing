# Migration Documentation

## Overview

Complete migration of TokenWiz ICO Dashboard from Bootstrap 4 to a proprietary CSS system.

## Decisions

### Layer Strategy

```css
@layer reset, base, layout, components, utilities;
```

- **reset** (base.css): Modern CSS reset — box-sizing, margin/padding zero, img max-width
- **base** (base.css): `:root` tokens, typography scale, body, links, headings
- **layout** (theme.css): `.container`, `.row`, CSS Grid column system, breakpoints
- **components** (theme.css): All BEM blocks
- **utilities** (theme.css): Minimal hand-rolled utilities only where Tailwind cannot reach

### Token Mapping

Design tokens extracted directly from `style.css` theme values. All colors, spacing, typography, shadows, and transitions are now CSS custom properties under `:root`.

### Tailwind Scoping

**Choice: Option A — CDN with layer isolation**

Tailwind applies exclusively inside `.page-content > .container`. The Tailwind CDN script is loaded after proprietary CSS. This is suitable for prototyping; for production, switch to Option B (prefix `tw-` with build step).

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    important: '.page-content .container',
    corePlugins: { preflight: false }
  }
</script>
```

### Grid System

Bootstrap's 12-column flexbox grid replaced with CSS Grid:

```css
.row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);
}
```

Only column classes actually used in the HTML are generated.

### Breakpoints

Mobile-first, mirroring Bootstrap 4:

| Name | Min-width |
|------|-----------|
| sm   | 576px     |
| md   | 768px     |
| lg   | 992px     |
| xl   | 1200px    |

### Third-Party Handling

Vendor plugins (Select2, DataTables, Datepicker, Timepicker, SimpleBar, Toastr, SweetAlert) retain their own class names. All overrides live in `vendors-override.css` — the only file permitted to use `!important`.

### BEM Naming

- Block: standalone component (`.topbar`, `.navbar`, `.card`, `.btn`)
- Element: child tied to block (`.topbar__logo`, `.card__title`)
- Modifier: variant (`.btn--primary`, `.card--token`)

Classes already clean in the original theme (e.g. `.topbar-wrap`, `.navbar-menu`) are kept as-is or converted to BEM only where it adds clarity.

## Files Produced

1. `base.css` — reset + `:root` tokens + base typography
2. `theme.css` — layout + all BEM components + minimal utilities
3. `vendors-override.css` — third-party overrides only
4. `index.html` — updated with new classes, Bootstrap removed
5. `MIGRATION-CLASS-MAP.md` — exhaustive before/after class mapping
