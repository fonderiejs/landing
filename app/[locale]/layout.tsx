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
        'Fonderie is the open standard for the SaaS backend — the auth, billing, teams, permissions, and multi-tenancy that every SaaS rebuilds before writing product code. It’s a skill wired into your repo, running in your process, against your database. You own the source (MIT), self-host it, and swap any provider. Free and open source — managed hosting is on the roadmap.',
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
            text: 'No. Fonderie is a skill wired into your project — not a hosted service. The skill files live in your repo; your AI reads them as project context, your server runs the generated code. No Fonderie server is ever in your request path, and we never host your data.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I swap Stripe for another provider?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The modules define the standard shape — subscriptions, seats, webhooks — and providers plug in behind it. Start on Stripe, move to Paddle, LemonSqueezy, or your own processor without rewriting your product code. The integration is the product; the provider is a detail.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Fonderie only for new projects?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It’s best on greenfield SaaS, where you skip two to three months of infrastructure. You can also adopt a single module — say billing or workspaces — in an existing codebase, because each module is plain TypeScript you own and register yourself.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does Fonderie cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Fonderie is free and open source under the MIT license. Every module is self-hosted on your own infrastructure with no usage limits and no vendor lock-in. Compare it to hiring a backend engineer for three months ($30–60k). Managed hosting and commercial support are on the roadmap.',
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
