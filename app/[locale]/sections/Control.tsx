import { useTranslations } from 'next-intl';
import { Row, Col } from '@/components/ui/Grid';

export default function Control() {
  const t = useTranslations('control');
  const steps = t.raw('steps') as { num: string; title: string; text: string }[];

  return (
    <section id="control" className="shift">
      <Row gutter="clamp(28px, 4vw, 48px)" align="start" className="shift__grid">
        <Col span={6} className="shift__copy" data-reveal>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="section-title">{t('title')}</h2>
          <p className="shift__lede">{t('lede')}</p>
        </Col>

        <Col span={6} className="shift__list" data-reveal>
          {steps.map((step) => (
            <div key={step.num} className="shift__item">
              <span className="shift__item-num">{step.num}</span>
              <div>
                <h3 className="shift__item-title">{step.title}</h3>
                <p className="shift__item-text">{step.text}</p>
              </div>
            </div>
          ))}
        </Col>
      </Row>

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
