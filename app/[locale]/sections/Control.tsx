import { useTranslations } from 'next-intl';

export default function Control() {
  const t = useTranslations('control');
  const steps = t.raw('steps') as { num: string; title: string; text: string }[];

  return (
    <section id="control" className="shift">
      <p className="eyebrow" data-reveal="">
        {t('eyebrow')}
      </p>
      <h2 className="section-title" data-reveal="">
        {t('title')}
      </h2>
      <p className="shift__lede" data-reveal="">
        {t('lede')}
      </p>

      <div className="shift__list" data-reveal="">
        {steps.map((step) => (
          <div key={step.num} className="shift__item">
            <span className="shift__item-num">{step.num}</span>
            <div>
              <h3 className="shift__item-title">{step.title}</h3>
              <p className="shift__item-text">{step.text}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="packages__footnote" data-reveal="">
        {t('footnote')}{' '}
        <a
          href="https://github.com/fonderiejs/fonderie/tree/main/.claude/skills/fonderie"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('footnoteLink')}
        </a>
      </p>
    </section>
  );
}
