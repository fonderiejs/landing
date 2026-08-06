import { cn } from '@/lib/utils';

export default function PackageCard({
  kicker,
  title,
  desc,
  href,
  featured = false,
}: {
  kicker: string;
  title: string;
  desc: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('packages__card', featured && 'packages__card--featured')}
    >
      <span className={cn('packages__card-kicker', featured && 'packages__card-kicker--accent')}>{kicker}</span>
      <h3 className={cn('packages__card-title', featured && 'packages__card-title--accent')}>{title}</h3>
      <p className="packages__card-text">{desc}</p>
    </a>
  );
}
