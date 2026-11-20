import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { LINKS } from '@/lib/site';
import Header from './components/Header';
import Footer from './components/Footer';
import SeatProvider from './components/SeatProvider';
import '../styles/tailwind.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// The colour a browser gives its own bar around the page (phones, Safari's
// coloured tab bar): white, whatever the page's first screen is painted with.
export const viewport: Viewport = { themeColor: '#ffffff' };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'common' });

  // The title is the motto. The description carries the promise, and no
  // price: prices are on the pricing page only.
  const title = `${t('siteTitle')} — ${t('meta.titleSuffix')}`;
  const description = t('meta.description');
  const ogImage = `/images/og-image-${locale}.png`;
  const canonicalPath = locale === 'en' ? '/' : `/${locale}`;

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
      canonical: canonicalPath,
      languages: Object.fromEntries(locales.map((l) => [l, l === 'en' ? '/' : `/${l}`])),
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: 'Fonderie',
      images: [{ url: ogImage, width: 1200, height: 630, type: 'image/png', alt: title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: ogImage, alt: title }],
    },
    // The mark (the brand set's favicon-dark.svg) in the forms browsers ask for:
    // the drawing for those that take one, a 96px picture and the .ico at the site's
    // root for those that do not (Safari before 26 among them), and a full square
    // that iOS rounds by itself (avatar-square-dark.svg).
    icons: {
      icon: [
        { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
        { url: '/images/icon.svg', type: 'image/svg+xml' },
      ],
      shortcut: '/favicon.ico',
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
  };
}

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
  const home = await getTranslations({ locale, namespace: 'home' });
  const questions = home.raw('faq.items') as { q: string; a: string; d: string }[];

  // What search engines are told: who we are, and the page's own six
  // questions in the reader's language. Nothing here that the page does
  // not say.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://fonderiejs.com/#organization',
        name: 'Fonderie',
        url: 'https://fonderiejs.com/',
        logo: 'https://fonderiejs.com/images/icon.svg',
        sameAs: [LINKS.github, LINKS.x],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://fonderiejs.com/#website',
        url: 'https://fonderiejs.com/',
        name: 'Fonderie',
        publisher: { '@id': 'https://fonderiejs.com/#organization' },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://fonderiejs.com/#faq',
        mainEntity: questions.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: `${item.a} ${item.d}` },
        })),
      },
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Manrope for headings, Inter for text, JetBrains Mono for labels:
            the brand's set, asked for as variable fonts
            because the page uses in-between weights (430 on buttons).
            Instrument Serif is still used by the contact and security
            pages. */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@100..900&family=JetBrains+Mono:wght@400..700&family=Manrope:wght@200..800&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@100..900&family=JetBrains+Mono:wght@400..700&family=Manrope:wght@200..800&display=swap"
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
          <SeatProvider>
            <div className="page">
              {/* outside the card: the card clips what it holds, and the
                  bar has to stay fixed to the window */}
              <Header />
              <div className="page__card">
                {children}
                <Footer />
              </div>
            </div>
          </SeatProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
