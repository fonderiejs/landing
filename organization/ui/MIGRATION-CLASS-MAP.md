# Migration Class Map

Exhaustive before/after class mapping for Bootstrap → BEM migration.

## Topbar

| Original Class | New BEM Class |
|---|---|
| `.topbar-wrap` | `.topbar-wrap` (kept) |
| `.topbar` | `.topbar` (kept) |
| `.topbar-logo` | `.topbar__logo` |
| `.topbar-nav` | `.topbar__nav` |
| `.topbar-nav-item` | `.topbar__nav-item` |

## Navbar

| Original Class | New BEM Class |
|---|---|
| `.navbar` | `.navbar` (kept) |
| `.navbar-innr` | `.navbar-innr` (kept) |
| `.navbar-menu` | `.navbar__menu` |
| `.navbar-menu > li.active` | `.navbar__menu > li.active` |
| `.navbar-dropdown` | `.navbar__dropdown` |
| `.navbar-btns` | `.navbar__btns` |
| `.has-dropdown` | `.has-dropdown` (kept) |

## Card

| Original Class | New BEM Class |
|---|---|
| `.card` | `.card` (kept) |
| `.card-innr` | `.card__body` |
| `.card-title` | `.card__title` |
| `.card-sub-title` | `.card__subtitle` |
| `.card-head` | `.card__head` |
| `.card-token` | `.card--token` |
| `.card-shadow` | `.card--shadow` |
| `.card-gradient-pri-sec` | `.card--gradient` |

## Button

| Original Class | New BEM Class |
|---|---|
| `.btn` | `.btn` (kept) |
| `.btn-primary` | `.btn--primary` |
| `.btn-secondary` | `.btn--secondary` |
| `.btn-success` | `.btn--success` |
| `.btn-danger` | `.btn--danger` |
| `.btn-warning` | `.btn--warning` |
| `.btn-info` | `.btn--info` |
| `.btn-light` | `.btn--light` |
| `.btn-dark` | `.btn--dark` |
| `.btn-outline` | `.btn--outline` |
| `.btn-sm` | `.btn--sm` |
| `.btn-lg` | `.btn--lg` |
| `.btn-xl` | `.btn--xl` |
| `.btn-block` | `.btn--block` |
| `.btn-icon` | `.btn--icon` |
| `.btn-auto` | `.btn--auto` |

## Badge

| Original Class | New BEM Class |
|---|---|
| `.badge` | `.badge` (kept) |
| `.badge-primary` | `.badge--primary` |
| `.badge-secondary` | `.badge--secondary` |
| `.badge-success` | `.badge--success` |
| `.badge-warning` | `.badge--warning` |
| `.badge-danger` | `.badge--danger` |
| `.badge-info` | `.badge--info` |
| `.badge-light` | `.badge--light` |
| `.badge-outline` | `.badge--outline` |
| `.badge-lg` | `.badge--lg` |
| `.badge-sm` | `.badge--sm` |

## Form Inputs

| Original Class | New BEM Class |
|---|---|
| `.input-item` | `.input-item` (kept) |
| `.input-item-label` | `.input-item__label` |
| `.input-bordered` | `.input--bordered` |
| `.input-solid` | `.input--solid` |
| `.select-wrapper` | `.select-wrapper` (kept) |

## Data Table

| Original Class | New BEM Class |
|---|---|
| `.data-table` | `.data-table` (kept) |
| `.data-col` | `.data-table__cell` |
| `.data-item` | `.data-table__row` |
| `.data-head` | `.data-table__head` |
| `.data-state` | `.data-state` (kept) |
| `.data-state-approved` | `.data-state--approved` |
| `.data-state-pending` | `.data-state--pending` |
| `.data-state-canceled` | `.data-state--canceled` |

## Modal

| Original Class | New BEM Class |
|---|---|
| `.modal` | `.modal` (kept) |
| `.modal-dialog` | `.modal__dialog` |
| `.modal-content` | `.modal__content` |
| `.modal-close` | `.modal__close` |
| `.popup-header` | `.popup__header` |
| `.popup-body` | `.popup__body` |
| `.popup-footer` | `.popup__footer` |

## Dropdown

| Original Class | New BEM Class |
|---|---|
| `.dropdown-content` | `.dropdown-content` (kept) |
| `.dropdown-list` | `.dropdown__list` |
| `.dropdown-list li` | `.dropdown__item` |

## User Menu

| Original Class | New BEM Class |
|---|---|
| `.user-dropdown` | `.user-menu` |
| `.user-status` | `.user-menu__status` |
| `.user-status-title` | `.user-menu__status-title` |
| `.user-status-balance` | `.user-menu__status-balance` |
| `.user-links` | `.user-menu__links` |
| `.user-thumb` | `.user-thumb` (kept) |
| `.user-photo` | `.user-photo` (kept) |

## Token Components

| Original Class | New BEM Class |
|---|---|
| `.token-sales` | `.token-sales` (kept) |
| `.token-balance` | `.token-balance` (kept) |
| `.token-calc` | `.token-calc` (kept) |
| `.token-overview` | `.token-overview` (kept) |

## Progress Bar

| Original Class | New BEM Class |
|---|---|
| `.progress-bar` | `.sale-progress` |
| `.progress-percent` | `.sale-progress__percent` |
| `.progress-hcap` | `.sale-progress__hcap` |
| `.progress-scap` | `.sale-progress__scap` |

## Alert / Note

| Original Class | New BEM Class |
|---|---|
| `.alert` | `.alert` (kept) |
| `.alert-primary` | `.alert--primary` |
| `.alert-success` | `.alert--success` |
| `.alert-danger` | `.alert--danger` |
| `.alert-warning` | `.alert--warning` |
| `.alert-info` | `.alert--info` |
| `.note` | `.note` (kept) |
| `.note-info` | `.note--info` |
| `.note-success` | `.note--success` |
| `.note-danger` | `.note--danger` |

## Pagination

| Original Class | New BEM Class |
|---|---|
| `.pagination` | `.pagination` (kept) |
| `.pagination li` | `.pagination__item` |
| `.pagination li.active` | `.pagination__item--active` |

## Nav Tabs

| Original Class | New BEM Class |
|---|---|
| `.nav-tabs` | `.nav-tabs` (kept) |
| `.nav-tabs-line` | `.nav-tabs--line` |
| `.nav-tabs-bordered` | `.nav-tabs--bordered` |

## Countdown

| Original Class | New BEM Class |
|---|---|
| `.countdown-clock` | `.countdown` |
| `.countdown-clock > div` | `.countdown__segment` |
| `.countdown-time` | `.countdown__time` |
| `.countdown-text` | `.countdown__label` |

## Timeline

| Original Class | New BEM Class |
|---|---|
| `.timeline` | `.timeline` (kept) |
| `.timeline-item` | `.timeline__item` |
| `.timeline-time` | `.timeline__time` |
| `.timeline-content` | `.timeline__content` |

## Status

| Original Class | New BEM Class |
|---|---|
| `.status` | `.status` (kept) |
| `.status-icon` | `.status__icon` |
| `.status-text` | `.status__text` |
| `.status-verified` | `.status--verified` |
| `.status-canceled` | `.status--canceled` |

## Footer Bar

| Original Class | New BEM Class |
|---|---|
| `.footer-bar` | `.footer-bar` (kept) |
| `.footer-links` | `.footer-bar__links` |

## Toggle / Switch

| Original Class | New BEM Class |
|---|---|
| `.toggle-nav` | `.toggle-nav` (kept) |
| `.input-switch` | `.input-switch` (kept) |
| `.simple-switch` | `.simple-switch` (kept) |

## Copy Widget

| Original Class | New BEM Class |
|---|---|
| `.copy-wrap` | `.copy-wrap` (kept) |
| `.copy-trigger` | `.copy-trigger` (kept) |
| `.copy-address` | `.copy-address` (kept) |

## Sidebar Nav

| Original Class | New BEM Class |
|---|---|
| `.sidebar-nav` | `.sidebar-nav` (kept) |
| `.sidebar-nav li` | `.sidebar-nav__item` |

## Page Header

| Original Class | New BEM Class |
|---|---|
| `.page-header` | `.page-header` (kept) |
| `.page-title` | `.page-header__title` |

## Bootstrap Utilities Removed

| Bootstrap Class | Replacement |
|---|---|
| `.d-flex` | `.d-flex` (hand-rolled utility) |
| `.d-none` | `.d-none` (hand-rolled utility) |
| `.d-lg-none` | `.d-lg-none` (hand-rolled utility) |
| `.d-none.d-lg-inline-block` | `.d-none.d-lg-inline-block` (hand-rolled) |
| `.align-items-center` | `.align-items-center` (hand-rolled) |
| `.justify-content-between` | `.justify-content-between` (hand-rolled) |
| `.justify-content-center` | `.justify-content-center` (hand-rolled) |
| `.justify-content-md-end` | `.justify-content-md-end` (hand-rolled) |
| `.relative` | `.relative` (hand-rolled) |
| `.mt-2` | `.mt-2` (hand-rolled) |
| `.mt-sm-0` | `.mt-sm-0` (hand-rolled) |
| `.row` | `.row` (CSS Grid replacement) |
| `.col-md-4` | `.col-md-4` (CSS Grid) |
| `.col-md-8` | `.col-md-8` (CSS Grid) |
| `.bg-light` | `.bg-light` (hand-rolled) |
| `.text-primary` | `.text-primary` (hand-rolled) |
| `.text-success` | `.text-success` (hand-rolled) |
| All `.mt-*`, `.p-*`, `.mb-*` inside `.page-content` | Tailwind classes |
