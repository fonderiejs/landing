'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/lib/navigation';
import { locales, localeNames, type Locale } from '@/lib/i18n';

export default function LocaleSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function select(l: Locale) {
    setOpen(false);
    if (l !== locale) router.replace(pathname, { locale: l });
  }

  return (
    <div className="locale-switch" ref={rootRef}>
      <button
        type="button"
        className="locale-switch__trigger"
        aria-label={t('localeSwitcher.label')}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          className="locale-switch__globe"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
          width={15}
          height={15}
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 3.75 5.5 3.75 9S14.5 18.5 12 21c-2.5-2.5-3.75-5.5-3.75-9S9.5 5.5 12 3z" />
        </svg>
        <span className="locale-switch__current">{localeNames[locale as Locale]}</span>
        <svg
          className="locale-switch__chevron"
          data-open={open ? '' : undefined}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
          width={13}
          height={13}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul className="locale-switch__menu" role="listbox" aria-label={t('localeSwitcher.label')}>
          {locales.map((l) => (
            <li key={l} role="none">
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                className="locale-switch__option"
                data-active={l === locale ? '' : undefined}
                onClick={() => select(l)}
              >
                <span className="locale-switch__option-name">{localeNames[l]}</span>
                <svg
                  className="locale-switch__check"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                  width={14}
                  height={14}
                >
                  <path d="M5 12.5l4.5 4.5L19 6.5" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
