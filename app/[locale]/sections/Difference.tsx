import { useTranslations } from 'next-intl';

export default function Difference() {
  const t = useTranslations('difference');

  return (
    <section className="difference">
      <div className="difference__inner">
        <p className="difference__eyebrow" data-reveal="">
          {t('eyebrow')}
        </p>
        <h2 className="section-title section-title--lg" data-reveal="">
          {t('title')}
        </h2>
        <p className="difference__lede" data-reveal="">
          {t('lede')}
        </p>
        <div className="difference__badges" data-reveal="">
          <span className="difference__badge">{t('badges.selfHosted')}</span>
          <span className="difference__badge difference__badge--filled">{t('badges.cloud')}</span>
        </div>
      </div>
    </section>
  );
}
