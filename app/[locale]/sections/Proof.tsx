import { useTranslations } from 'next-intl';
import StatCounter from '@/components/ui/StatCounter';

export default function Proof() {
  const t = useTranslations('proof');
  const stats = t.raw('stats') as { value: string; label: string; sub: string }[];

  return (
    <section id="proof" className="proof">
      <p className="eyebrow eyebrow--wide" data-reveal="">
        {t('eyebrow')}
      </p>
      <div className="proof__grid" data-reveal="">
        {stats.map((stat, i) => (
          <div key={stat.label} className="proof__cell">
            <StatCounter value={stat.value} accent={i === stats.length - 1} />
            <p className="proof__label">{stat.label}</p>
            <p className="proof__sub">{stat.sub}</p>
          </div>
        ))}
      </div>
      <blockquote className="proof__testimonial" data-reveal="">
        <p>&ldquo;{t('testimonial.quote')}&rdquo;</p>
        <cite>{t('testimonial.attribution')}</cite>
      </blockquote>
      <p className="proof__sub" data-reveal="">
        {t('securityUpdateLine')}
      </p>
      {/* Hidden for now
      <p className="proof__metric" data-reveal="">
        {t('metric')}
      </p>
      <p className="proof__footnote" data-reveal="">
        {t('footnote')}{' '}
        <a href="https://github.com/fonderiejs/fonderie" target="_blank" rel="noopener noreferrer">
          {t('footnoteLink')}
        </a>
      </p>
      */}
    </section>
  );
}
