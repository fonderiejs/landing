import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import MobileNav from './MobileNav';

export default function Navbar() {
  const t = useTranslations('common');

  const links = [
    { href: '#control', label: t('nav.solution') },
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
        </a>

        <MobileNav links={links} />
      </div>
    </nav>
  );
}
