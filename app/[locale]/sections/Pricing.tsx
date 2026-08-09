import { useTranslations } from 'next-intl';
import PricingCard from '../components/PricingCard';

export default function Pricing() {
  const t = useTranslations('pricing');
  // Mobile tier disabled for now
  const tiers = t.raw('tiers').filter((tier: any) => tier.name !== 'Mobile');

  return (
    <section id="pricing" className="pricing">
      <p className="eyebrow" data-reveal="">
        {t('eyebrow')}
      </p>
      <h2 className="section-title" data-reveal="">
        {t('title')}
      </h2>
      <p className="pricing__lede" data-reveal="">
        {t('lede')}
      </p>

      <div className="pricing__grid" data-reveal="">
        {tiers.map((tier: any) => (
          <PricingCard key={tier.name} tier={tier} />
        ))}
      </div>

      <div className="pricing__note" data-reveal="">
        <p className="pricing__note-italic">{t('compareNote1')}</p>
        <p className="pricing__note-accent">{t('compareNote2')}</p>
        <p className="pricing__note-muted">{t('compareNote3')}</p>
      </div>
    </section>
  );
}
