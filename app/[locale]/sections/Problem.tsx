import { useTranslations } from 'next-intl';

export default function Problem() {
  const t = useTranslations('problem');
  const items = t.raw('items') as { title: string; text: string }[];

  return (
    <section className="problem">
      <div className="problem__grid">
        <div className="problem__copy">
          <p className="eyebrow" data-reveal="">
            {t('eyebrow')}
          </p>
          <h2 className="section-title section-title--sm" data-reveal="">
            {t('title')}
          </h2>
          <p className="problem__lede" data-reveal="">
            {t('lede')}
          </p>
        </div>
        <div className="shift__list" data-reveal="">
          {items.map((item, i) => (
            <div key={item.title} className="shift__item">
              <span className="shift__item-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="shift__item-title">{item.title}</h3>
                <p className="shift__item-text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="problem__ledger" data-reveal="">
          <div className="problem__ledger-foot">
            <p className="problem__ledger-note">
              <b className="problem__ledger-note-head">{t('byHandTitle')}</b>
              <br />
              {t('byHandText')}
            </p>
            <p className="problem__ledger-note">
              <b className="problem__ledger-note-head">{t('withAiTitle')}</b>
              <br />
              {t('withAiText')}
            </p>
            <p className="problem__ledger-note">
              <b className="problem__ledger-note-head--accent">{t('withFonderieTitle')}</b>
              <br />
              {t('withFonderieText')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
