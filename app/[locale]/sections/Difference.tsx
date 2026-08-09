import { useTranslations } from 'next-intl';

export default function Difference() {
  const t = useTranslations('difference');
  const cards = t.raw('cards') as { title: string; text: string }[];

  return (
    <section className="difference">
      <div className="difference__inner">
        <p className="difference__eyebrow" data-reveal="">
          {t('eyebrow')}
        </p>
        <h2 className="section-title section-title--lg" data-reveal="">
          {t('title')}
        </h2>
        <div className="packages__grid" data-reveal="">
          {cards.map((card) => (
            <div key={card.title} className="packages__card">
              <h3 className="packages__card-title">{card.title}</h3>
              <p className="packages__card-text">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
