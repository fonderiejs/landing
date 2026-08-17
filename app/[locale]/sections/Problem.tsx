import { useTranslations } from 'next-intl';
import { Row, Col } from '@/components/ui/Grid';

export default function Problem() {
  const t = useTranslations('problem');
  const items = t.raw('items') as { title: string; text: string }[];

  return (
    <section className="problem">
      <Row
        gutter="clamp(28px, 4vw, 48px)"
        align="start"
        className="problem__grid"
      >
        {/* Left column: copy only */}
        <Col span={6} className="problem__copy" data-reveal>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="section-title section-title--sm">{t('title')}</h2>
          <p className="problem__lede">{t('lede')}</p>
          <p className="problem__lede">{t('marketScale')}</p>
        </Col>

        {/* Right column: numbered list */}
        <Col span={6} className="shift__list" data-reveal>
          {items.map((item, i) => (
            <div key={item.title} className="shift__item">
              <span className="shift__item-num">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="shift__item-title">{item.title}</h3>
                <p className="shift__item-text">{item.text}</p>
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </section>
  );
}

