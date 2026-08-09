import { useTranslations } from 'next-intl';

export default function Problem() {
  const t = useTranslations('problem');
  const timeline = t.raw('timeline') as { week: string; label: string }[];
  const mobileTimeline = t.raw('mobileTimeline') as { week: string; label: string }[];
  const half = Math.ceil(timeline.length / 2);

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
            {t('lede')} <strong className="problem__lede-strong">{t('ledeStrong')}</strong>
          </p>
          <p className="problem__compare" data-reveal="">
            {t('compareBefore')} <s className="problem__strike">{t('comparePriceStrike')}</s>. {t('compareAfter')}{' '}
            <b className="problem__free">{t('compareFree')}</b>
          </p>
          <p className="problem__compare" data-reveal="">
            {t('mobileCompare')}
          </p>
          <p className="problem__compare" data-reveal="">
            <b className="problem__free">{t('customApiLine')}</b>
          </p>
          <p className="problem__compare" data-reveal="">
            {t('tokenBurnLine')}
          </p>
          <p className="problem__compare" data-reveal="">
            {t('opportunityCostLine')}
          </p>
        </div>
        <div className="problem__ledger" data-reveal="">
          <p className="problem__ledger-head">
            {t('ledgerHeading')} <b className="problem__ledger-head-strong">{t('ledgerDuration')}</b>
          </p>
          <div>
            <div>
              {timeline.slice(0, half).map((row) => (
                <div key={row.week} className="problem__ledger-row">
                  <span className="problem__ledger-week">{row.week}</span> {row.label}
                </div>
              ))}
            </div>
            <div>
              {timeline.slice(half).map((row, i) => {
                const isLast = i === timeline.length - half - 1;
                return (
                  <div key={row.week} className={`problem__ledger-row${isLast ? ' problem__ledger-row--final' : ''}`}>
                    <span className={`problem__ledger-week${isLast ? ' problem__ledger-week--accent' : ''}`}>{row.week}</span>{' '}
                    {row.label}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="problem__ledger-foot">
            <p className="problem__ledger-note">
              <b className="problem__ledger-note-head">{t('byHandTitle')}</b>
              <br />
              {t('byHandText')}
            </p>
            <p className="problem__ledger-note">
              <b className="problem__ledger-note-head--accent">{t('withAiTitle')}</b>
              <br />
              {t('withAiText')}
            </p>
          </div>
        </div>
        <div className="problem__ledger" data-reveal="">
          <p className="problem__ledger-head">
            {t('mobileLedgerHeading')} <b className="problem__ledger-head-strong">{t('mobileLedgerDuration')}</b>
          </p>
          <div>
            <div>
              {mobileTimeline.map((row, i) => {
                const isLast = i === mobileTimeline.length - 1;
                return (
                  <div key={row.week} className={`problem__ledger-row${isLast ? ' problem__ledger-row--final' : ''}`}>
                    <span className={`problem__ledger-week${isLast ? ' problem__ledger-week--accent' : ''}`}>{row.week}</span>{' '}
                    {row.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
