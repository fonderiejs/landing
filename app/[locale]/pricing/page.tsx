import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/lib/i18n';
import { mailto } from '@/lib/site';
import SeatButton from '../components/SeatButton';
import '../../styles/pricing.css';

// The one page of the site that shows a price. Every number comes from the
// messages; the page is dated so that an archived copy cannot pass for
// current.

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pricing' });
  const canonical = locale === 'en' ? '/pricing' : `/${locale}/pricing`;
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical,
      languages: Object.fromEntries(locales.map((l) => [l, l === 'en' ? '/pricing' : `/${l}/pricing`])),
    },
    openGraph: { title: t('metaTitle'), description: t('metaDescription'), url: canonical, siteName: 'Fonderie', type: 'website' },
    twitter: { card: 'summary', title: t('metaTitle'), description: t('metaDescription') },
  };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pricing');
  const c = await getTranslations('common.cta');
  const pilotItems = t.raw('pilot.items') as string[];
  const pilotTerms = t.raw('pilot.terms') as string[];
  const runItems = t.raw('run.items') as string[];

  return (
    <main className="f-pricing">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <p className="f-pricing__eyebrow">{t('eyebrow')}</p>
        <h1 className="f-pricing__title">
          <span>{t('title1')}</span> <span>{t('title2')}</span>
        </h1>
        <p className="f-pricing__lede">{t('lede')}</p>

        <div className="f-plans">
          <section className="f-plan">
            <p className="f-plan__kicker">{t('pilot.kicker')}</p>
            <h2 className="f-plan__name">{t('pilot.name')}</h2>
            <p className="f-plan__price">
              {t('pilot.price')} <span className="f-plan__per">{t('pilot.per')}</span>
            </p>
            <p className="f-plan__desc">{t('pilot.desc')}</p>
            <ul className="f-plan__list">
              {pilotItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul className="f-plan__terms">
              {pilotTerms.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
            <p className="mt-auto pt-2">
              <SeatButton className="f-plan__btn" />
            </p>
          </section>

          <section className="f-plan f-plan--featured">
            <p className="f-plan__kicker">{t('run.kicker')}</p>
            <h2 className="f-plan__name">{t('run.name')}</h2>
            <p className="f-plan__price">
              {t('run.price')} <span className="f-plan__per">{t('run.per')}</span>
            </p>
            <p className="f-plan__fee">{t('run.fee')}</p>
            <p className="f-plan__desc">{t('run.desc')}</p>
            <ul className="f-plan__list">
              {runItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="f-plan__compare">{t('run.compare')}</p>
            <p className="f-plan__status">{t('run.status')}</p>
            <p className="mt-auto pt-2">
              <SeatButton className="f-plan__btn" />
            </p>
          </section>
        </div>

        <div className="f-pricing__foot">
          <p>{t('asOf')}</p>
          <a className="f-pricing__ask" href={mailto(c('askSubject'))}>
            {c('ask')}
          </a>
        </div>
      </div>
    </main>
  );
}
