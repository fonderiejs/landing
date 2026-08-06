'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type Theme = 'system' | 'light' | 'dark';
const STORAGE_KEY = 'fonderie-theme';

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export default function ThemeSwitcher() {
  const t = useTranslations('common');
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored ?? 'system';
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function handleChange(next: Theme) {
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  const options: Theme[] = ['system', 'light', 'dark'];

  return (
    <div className="theme-switch" aria-label={t('theme.label')}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className="theme-btn"
          data-theme-btn={option}
          data-active={theme === option ? '' : undefined}
          onClick={() => handleChange(option)}
        >
          {t(`theme.${option}`)}
        </button>
      ))}
    </div>
  );
}
