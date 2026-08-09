import { useTranslations } from 'next-intl';

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
          <a href="#how" className="btn btn--ghost">
            {tc('cta.howItWorks')}
          </a>
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
