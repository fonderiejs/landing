import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

export default function Footer() {
  const t = useTranslations('common');

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__col">
            <a href="https://github.com/fonderiejs/fonderie" className="site-footer__head">
              {t('footer.openSource')}
            </a>
            <a href="https://github.com/fonderiejs/fonderie" className="site-footer__link">
              {t('footer.github')}
            </a>
            <a href="https://www.npmjs.com/package/@fonderie/core" className="site-footer__link">
              {t('footer.npmInstall')}
            </a>
          </div>
          <div className="site-footer__col">
            <p className="site-footer__head">{t('footer.company')}</p>
            <Link href="/contact" className="site-footer__link">
              {t('footer.contact')}
            </Link>
            <a href="https://x.com/fonderiejs" className="site-footer__link">
              {t('footer.twitter')}
            </a>
          </div>
        </div>
        <div className="site-footer__bottom">
          <div className="site-footer__meta">
            <p>{t('footer.copyright')}</p>
            <a href="https://github.com/fonderiejs/fonderie" aria-label="GitHub" className="site-footer__social">
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width={16} height={16}>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <a href="https://x.com/fonderiejs" aria-label="Fonderie on X" className="site-footer__social">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={15} height={15}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
          <div className="site-footer__controls">
            <ThemeSwitcher />
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
