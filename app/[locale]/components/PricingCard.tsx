import { cn } from '@/lib/utils';

type Tier = {
  name: string;
  price: string;
  period: string;
  desc: string;
  featuresLead?: string;
  features: string[];
  cta: string;
  featured: boolean;
};

export default function PricingCard({ tier }: { tier: Tier }) {
  return (
    <div className={cn('pricing__tier', tier.featured && 'pricing__tier--featured')}>
      <div className="pricing__tier-head">
        <h3 className={cn('pricing__tier-name', tier.featured && 'pricing__tier-name--accent')}>{tier.name}</h3>
        <p className="pricing__tier-price">
          {tier.price}
          {tier.period && <span className="pricing__tier-price-period">{tier.period}</span>}
        </p>
        <p className="pricing__tier-desc">{tier.desc}</p>
      </div>
      <div className="pricing__tier-features">
        {tier.featuresLead && <p className="pricing__tier-features-lead">{tier.featuresLead}</p>}
        {tier.features.map((f) => (
          <p key={f}>{f}</p>
        ))}
      </div>
      <a
        href={tier.cta.toLowerCase().includes('contact') ? '/contact' : 'https://github.com/fonderiejs/fonderie'}
        className={cn('pricing__tier-cta', tier.featured && 'pricing__tier-cta--solid')}
      >
        {tier.cta}
      </a>
    </div>
  );
}
