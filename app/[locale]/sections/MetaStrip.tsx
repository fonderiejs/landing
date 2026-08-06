import { useTranslations } from 'next-intl';

export default function MetaStrip() {
  const t = useTranslations('problem');

  return (
    <section className="meta-strip">
      <span>
        <code>{t('metaStrip.command')}</code>
      </span>
      <span>{t('metaStrip.modules')}</span>
      <span>{t('metaStrip.noExternal')}</span>
    </section>
  );
}
