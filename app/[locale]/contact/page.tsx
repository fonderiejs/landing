import { getTranslations, setRequestLocale } from 'next-intl/server';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { locales } from '@/lib/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const cells = ['email', 'fit', 'response'] as const;

  return (
    <>
      <Navbar />
      <main className="page__card--flush">
        <section className="subhero container">
          <h1 className="subhero__title">{t('title')}</h1>
          <p className="subhero__lede">{t('lede')}</p>
        </section>
        <section className="contact-cells container">
          <div className="contact-cells__grid">
            {cells.map((key) => (
              <div key={key} className="contact-cells__cell">
                <h2 className="contact-cells__label">{t(`${key}.label`)}</h2>
                <p className="contact-cells__value">{t(`${key}.value`)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
