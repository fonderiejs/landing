import { useTranslations } from 'next-intl';
import PackageCard from '../components/PackageCard';

export default function Packages() {
  const t = useTranslations('packages');
  const items = t.raw('items') as { name: string; desc: string }[];
  const mobileItems = t.raw('mobileItems') as { name: string; desc: string }[];
  const adapterItems = t.raw('adapterItems') as { name: string; desc: string }[];

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

      <h3 className="packages__category" data-reveal="">
        {t('categories.backend')}
      </h3>
      <div className="packages__grid" data-reveal="">
        {items.map((pkg) => (
          <PackageCard
            key={pkg.name}
            kicker={t('categories.backend')}
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

      <h3 className="packages__category" data-reveal="">
        {t('categories.mobile')}
      </h3>
      <div className="packages__grid" data-reveal="">
        {mobileItems.map((pkg) => (
          <PackageCard
            key={pkg.name}
            kicker={t('categories.mobile')}
            title={pkg.name}
            desc={pkg.desc}
            href={`https://www.npmjs.com/package/${pkg.name}`}
          />
        ))}
      </div>

      <h3 className="packages__category" data-reveal="">
        {t('categories.adapters')}
      </h3>
      <div className="packages__grid" data-reveal="">
        {adapterItems.map((pkg) => (
          <PackageCard
            key={pkg.name}
            kicker={t('categories.adapters')}
            title={pkg.name}
            desc={pkg.desc}
            href={`https://www.npmjs.com/package/${pkg.name}`}
          />
        ))}
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
