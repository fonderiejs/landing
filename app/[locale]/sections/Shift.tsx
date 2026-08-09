import { useTranslations } from 'next-intl';
import CodeBlock from '@/components/ui/CodeBlock';

export default function Shift() {
  const t = useTranslations('shift');
  const features = t.raw('features') as { num: string; title: string; text: string }[];

  const code = `${t('codeComment')}
auth({ oauth, passkeys })
workspaces({ multiTenant })
billing({ provider, seats })
permissions({ roles })`;

  return (
    <section id="how" className="shift">
      <p className="eyebrow" data-reveal="">
        {t('eyebrow')}
      </p>
      <h2 className="section-title" data-reveal="">
        {t('title')}
      </h2>
      <p className="shift__lede" data-reveal="">
        {t('lede')}
      </p>

      <div className="shift__grid">
        <div className="shift__list" data-reveal="">
          {features.map((f) => (
            <div key={f.num} className={`shift__item${f.num === '04' ? ' shift__item--featured' : ''}`}>
              <span className="shift__item-num">{f.num}</span>
              <div>
                <h3 className="shift__item-title">{f.title}</h3>
                <p className="shift__item-text">{f.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="shift__panel" data-reveal="">
          <p className="shift__panel-label">{t('codeLabel')}</p>
          <div className="shift__code">
            <CodeBlock code={code} />
          </div>
          <p className="shift__panel-foot">{t('codeFooter')}</p>
          <div className="shift__code">
            <CodeBlock code={`${t('codeMobileComment')}\n${t.raw('codeMobileImport')}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
