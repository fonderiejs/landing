import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'common' });

  const title = `${t('siteTitle')} — ${t('meta.titleSuffix')}`;
  const description = t('meta.description');

  return {
    title,
    description,
    applicationName: 'Fonderie',
    authors: [{ name: 'Fonderie' }],
    creator: 'Fonderie',
    publisher: 'Fonderie',
    category: 'technology',
    formatDetection: { telephone: false, address: false, email: false },
    appleWebApp: { title: 'Fonderie', statusBarStyle: 'default', capable: true },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    manifest: '/manifest.json',
    metadataBase: new URL('https://fonderiejs.com'),
    alternates: {
      canonical: locale === 'en' ? '/' : `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, l === 'en' ? '/' : `/${l}`])),
    },
    openGraph: {
      title,
      description,
      url: 'https://fonderiejs.com',
      siteName: 'Fonderie',
      images: [{ url: '/images/og-image.png', width: 1200, height: 630, type: 'image/png', alt: title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: '/images/og-image.png', width: 1200, height: 630, type: 'image/png', alt: title }],
    },
    icons: { icon: '/images/icon.svg' },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://fonderiejs.com/#organization',
      name: 'Fonderie',
      url: 'https://fonderiejs.com/',
      logo: 'https://fonderiejs.com/images/icon.svg',
      sameAs: ['https://github.com/fonderiejs/fonderie', 'https://x.com/fonderiejs'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://fonderiejs.com/#website',
      url: 'https://fonderiejs.com/',
      name: 'Fonderie',
      publisher: { '@id': 'https://fonderiejs.com/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://fonderiejs.com/#software',
      name: 'Fonderie',
      url: 'https://fonderiejs.com/',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      description:
        'Ship your SaaS in a week. Fonderie gives AI assistants the building blocks for auth, billing, and team management — so founders focus on their product, not infrastructure.',
      downloadUrl: 'https://github.com/fonderiejs/fonderie',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': 'https://fonderiejs.com/#organization' },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://fonderiejs.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Fonderie a service? Do you host my data?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Fonderie is not a hosted service — your data stays on your own servers. Your AI assistant uses Fonderie as a set of building blocks when it builds your product, and everything runs on your own infrastructure.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I swap Stripe for another payment provider?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Payments, subscriptions, and invoices work the same way no matter which provider is behind them. Start on Stripe, move to another processor later, and your product keeps working without a rewrite.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Fonderie only for new products?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It works best when you\'re starting a new SaaS, where it saves you two to three months of work. You can also add a single piece — like billing or team management — to a product you\'ve already started.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does Fonderie cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Free to start, with no usage limits and no vendor lock-in. Compare that to hiring a developer for three months ($30,000–$60,000). Paid plans add priority support, team features, and enterprise options as you grow.',
          },
        },
      ],
    },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* Runs before paint to avoid a flash of the wrong theme - the
            React-side ThemeSwitcher effect runs too late for that. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('fonderie-theme');var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="page">
            <div className="page__card">{children}</div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
