import { getTranslations, setRequestLocale } from 'next-intl/server';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { locales } from '@/lib/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SecurityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('security');
  const groups = t.raw('groups') as { title: string; items: { title: string; text: string }[] }[];

  return (
    <>
      <Navbar />
      <main className="page__card--flush">
        <section className="subhero container">
          <h1 className="subhero__title">{t('title')}</h1>
          <p className="subhero__lede">{t('lede')}</p>
        </section>

        {groups.map((group) => (
          <section key={group.title} className="packages">
            <div className="container">
              <h2 className="section-title section-title--sm">{group.title}</h2>
              <div className="packages__grid">
                {group.items.map((item) => (
                  <div key={item.title} className="packages__card">
                    <h3 className="packages__card-title">{item.title}</h3>
                    <p className="packages__card-text">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="subhero container">
          <p className="subhero__lede">
            {t('discloseLead')} {t('discloseText')}{' '}
            <a href={t('discloseLinkHref')} target="_blank" rel="noopener noreferrer">
              {t('discloseLinkText')}
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
