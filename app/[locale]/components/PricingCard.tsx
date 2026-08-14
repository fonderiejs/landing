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
  hidden?: boolean;
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

      <a
        href={tier.cta.toLowerCase().includes('contact') ? '/contact' : 'https://github.com/fonderiejs/fonderie'}
        className={cn('pricing__tier-cta', tier.featured && 'pricing__tier-cta--solid')}
      >
        {tier.cta}
      </a>

      <div className="pricing__tier-features">
        {tier.featuresLead && <p className="pricing__tier-features-lead">{tier.featuresLead}:</p>}
        <ul className="pricing__tier-list">
          {tier.features.map((f) => (
            <li key={f} className="pricing__tier-list-item">
              <svg
                className="pricing__tier-check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                width={16}
                height={16}
              >
                <path d="m9 12 2 2 4-4" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
