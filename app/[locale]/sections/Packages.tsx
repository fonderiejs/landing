import { useTranslations } from 'next-intl';
import Numerals from '@/components/ui/Numerals';

export default function Packages() {
  const t = useTranslations('packages');
  const items = t.raw('items') as { title: string; text: string }[];

  return (
    <section id="packages" className="packages">
      <p className="eyebrow" data-reveal="">
        {t('eyebrow')}
      </p>
      <h2 className="section-title" data-reveal="">
        {t('title')}
      </h2>
      <p className="packages__lede" data-reveal="">
        <Numerals>{t('lede')}</Numerals>
      </p>

      <div className="packages__grid" data-reveal="">
        {items.map((item) => (
          <div key={item.title} className="packages__card">
            <h3 className="packages__card-title">{item.title}</h3>
            <p className="packages__card-text">
              <Numerals>{item.text}</Numerals>
            </p>
          </div>
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
