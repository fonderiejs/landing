import { useTranslations } from 'next-intl';
import PackageCard from '../components/PackageCard';

export default function Packages() {
  const t = useTranslations('packages');
  const items = t.raw('items') as { name: string; desc: string }[];

  return (
    <section id="packages" className="packages">
      <p className="eyebrow" data-reveal="">
        {t('eyebrow')}
      </p>
      <h2 className="section-title" data-reveal="">
        {t('title')}
      </h2>
      <p className="packages__lede" data-reveal="">
        {t('lede')}
      </p>

      <div className="packages__grid" data-reveal="">
        {items.map((pkg) => (
          <PackageCard
            key={pkg.name}
            kicker={t('businessLogic')}
            title={pkg.name}
            desc={pkg.desc}
            href={`https://www.npmjs.com/package/${pkg.name}`}
          />
        ))}
        <PackageCard
          kicker={t('moreCard.kicker')}
          title={t('moreCard.title')}
          desc={t('moreCard.desc')}
          href="https://github.com/fonderiejs/fonderie"
          featured
        />
      </div>

      <p className="packages__footnote" data-reveal="">
        {t('footnote')}{' '}
        <a href="https://github.com/fonderiejs/fonderie" target="_blank" rel="noopener noreferrer">
          {t('footnoteLink')}
        </a>
      </p>
    </section>
  );
}
