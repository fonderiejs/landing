import { useTranslations } from 'next-intl';

export default function Difference() {
  const t = useTranslations('difference');
  const rows = t.raw('rows') as { label: string; alt: string; fonderie: string }[];

  return (
    <section className="difference">
      <div className="difference__inner">
        <p className="difference__eyebrow" data-reveal="">
          {t('eyebrow')}
        </p>
        <h2 className="section-title section-title--lg" data-reveal="">
          {t('title')}
        </h2>
        <div className="difference__table-wrap" data-reveal="">
          <table className="difference__table">
            <thead>
              <tr>
                <th />
                <th>{t('tableHeadAlt')}</th>
                <th>{t('tableHeadFonderie')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.alt}</td>
                  <td>
                    <strong>{row.fonderie}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="difference__closing" data-reveal="">
          {t('closing')}
        </p>
      </div>
    </section>
  );
}
