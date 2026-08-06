import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './i18n';

// No middleware.ts here on purpose - middleware needs a server/edge
// runtime, which a `next export` static site doesn't have. Locale
// prefixes are resolved entirely at build time via generateStaticParams
// on the [locale] segment, and every locale (including English) is
// prerendered at a prefixed path (/en, /de, ...) - there is no
// unprefixed static route, so localePrefix must be "always" or these
// Link/router helpers would point at a path that doesn't exist.
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
