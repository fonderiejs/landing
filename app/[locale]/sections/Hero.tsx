import { useTranslations } from 'next-intl';
import CopyButton from '@/components/ui/CopyButton';

export default function Hero() {
  const t = useTranslations('hero');
  const tc = useTranslations('common');
  const assistants = [
    { key: 'claudeCode', icon: 'claude-color', dim: false },
    { key: 'cursor', icon: 'cursor', dim: true },
    { key: 'codex', icon: 'openai', dim: true },
    { key: 'windsurf', icon: 'windsurf', dim: true },
    { key: 'any', icon: null, dim: false },
  ] as const;

  return (
    <header className="hero">
      <div className="hero__backdrop" aria-hidden="true" />
      <div className="hero__inner">
        <p className="hero__eyebrow">{t('eyebrow')}</p>
        <h1 className="hero__title">
          {t('titleLine1')} <span className="hero__title-nowrap">{t('titleLine2')}</span>
        </h1>
        <p className="hero__lede">
          {t('lede')} <span className="hero__lede-strong">{t('ledeStrong')}</span>
        </p>
        <div className="hero__cta">
          <a href="https://github.com/fonderiejs/fonderie" target="_blank" rel="noopener noreferrer" className="btn btn--dark">
            {tc('cta.getStarted')}
            <span className="btn__chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </span>
          </a>
          <a href="https://github.com/fonderiejs/fonderie" target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width={16} height={16}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {tc('cta.viewOnGitHub')}
          </a>
        </div>
        <div className="hero__snippet">
          <code className="hero__snippet-code">
            <span className="hero__snippet-muted">$</span> npx <span className="hero__snippet-pkg">@fonderie/create</span> my-saas
          </code>
          <CopyButton text={t('command')} copyLabel={t('copy')} copiedLabel={t('copied')} />
        </div>
        <div className="hero__proof">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--stage)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={15} height={15}>
            <path d="m9 12 2 2 4-4" />
            <circle cx={12} cy={12} r={10} />
          </svg>
          {t('proof')}
        </div>
      </div>
      <div className="hero__assistants" aria-label="Compatible AI assistants">
        <span className="hero__assistants-label">{t('worksWith')}</span>
        <div className="hero__assistants-list">
          {assistants.map((a) => (
            <span key={a.key} className="hero__assistant">
              {a.icon && (
                <img
                  src={`https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/${a.icon}.svg`}
                  alt=""
                  width={24}
                  height={24}
                  className={`hero__assistant-icon${a.dim ? ' hero__assistant-icon--dim' : ''}`}
                />
              )}
              <span className="hero__assistant-name">{t(`assistants.${a.key}`)}</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
