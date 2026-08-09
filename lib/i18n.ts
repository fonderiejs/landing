import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// "as-needed" strategy: the default locale (en) has no URL prefix at
// all (/  is English), every other locale is prefixed (/de, /fr, ...).
// GitHub Pages has no server, so there's no way to do a server-side
// redirect from / to /en - as-needed avoids needing one entirely.
export const locales = ['en', 'de', 'fr', 'pt-BR', 'ja', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  'pt-BR': 'Português',
  ja: '日本語',
  zh: '中文',
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  if (!locales.includes(requested as Locale)) notFound();
  const locale = requested as Locale;

  const sections = ['common', 'hero', 'problem', 'shift', 'proof', 'packages', 'difference', 'pricing', 'contact'];
  const messages = Object.fromEntries(
    await Promise.all(
      sections.map(async (section) => [section, (await import(`../messages/${locale}/${section}.json`)).default])
    )
  );

  return { locale, messages };
});
