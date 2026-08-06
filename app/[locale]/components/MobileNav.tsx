'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

export default function MobileNav({ links }: { links: { href: string; label: string; external?: boolean }[] }) {
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const sheet = (
    <div className={`mobile-menu${open ? ' is-open' : ''}`} id="mobile-menu" aria-hidden={!open}>
      <div className="mobile-menu__backdrop" onClick={() => setOpen(false)} />
      <div className="mobile-menu__sheet" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="mobile-menu__handle" aria-hidden="true" />
        <button type="button" className="mobile-menu__close" aria-label="Close menu" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <h2 className="mobile-menu__title">Menu</h2>
        <nav className="mobile-menu__links">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              onClick={() => setOpen(false)}
              className="mobile-menu__link"
            >
              <span className="mobile-menu__link-label">
                {link.external && (
                  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width={16} height={16}>
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                )}
                {link.label}
              </span>
              <svg className="mobile-menu__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          ))}
        </nav>
        <hr className="mobile-menu__divider" />
        <div className="mobile-menu__cta-wrap">
          <a
            href="https://github.com/fonderiejs/fonderie"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn btn--dark mobile-menu__cta"
          >
            {t('cta.getStarted')}
            <span className="btn__chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="nav__burger"
        aria-label="Toggle menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Rendered via portal to document.body: source markup has .mobile-menu
          as a sibling of .page, not nested inside .page__card. Nesting it
          there breaks position:fixed, since .page__card's overflow:clip
          creates a containing block for fixed descendants, clipping the
          sheet to the card instead of covering the viewport. */}
      {mounted ? createPortal(sheet, document.body) : null}
    </>
  );
}
