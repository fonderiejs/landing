import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import MobileNav from './MobileNav';

export default function Navbar() {
  const t = useTranslations('common');

  const links = [
    { href: '#how', label: t('nav.solution') },
    { href: '#packages', label: t('nav.packages') },
    { href: '#pricing', label: t('nav.pricing') },
    { href: 'https://github.com/fonderiejs/fonderie', label: t('nav.github'), external: true },
  ];

  return (
    <nav className="nav">
      <div className="nav__inner container">
        <Link href="/" className="nav__logo">
          {t('siteTitle')}
        </Link>

        <div className="nav__links">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav__link">
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="https://github.com/fonderiejs/fonderie"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--dark-sm"
        >
          {t('cta.getStarted')}
          <span className="btn__chip btn__chip--sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" width={12} height={12}>
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </span>
        </a>

        <MobileNav links={links} />
      </div>
    </nav>
  );
}
