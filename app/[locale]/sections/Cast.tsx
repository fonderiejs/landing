import { getTranslations } from 'next-intl/server';
import { mailto } from '@/lib/site';
import SeatButton from '../components/SeatButton';
import CastPrompt from './CastPrompt';

// The orange panel: the same parts, every time.
export default async function Cast() {
  const t = await getTranslations('home.cast');
  const c = await getTranslations('common.cta');
  return (
    <section className="f-cast">
      <div className="f-cast__row">
        <div className="f-cast__left">
          <p className="f-cast__eyebrow">{t('eyebrow')}</p>
          <h2 className="f-cast__head">
            <span>{t('title1')}</span> <span>{t('title2')}</span>
          </h2>
          <p className="f-cast__lede">{t('lede')}</p>
          <div className="f-cast__ctas">
            <SeatButton className="f-cast__btn" />
            <a className="f-cast__link" href={mailto(c('askSubject'))}>
              {c('ask')}
            </a>
          </div>
        </div>
        <div className="f-cast__right">
          <CastPrompt
            prompts={[
              { text: t('p1'), chip: t('c1') },
              { text: t('p2'), chip: t('c2') },
              { text: t('p3'), chip: t('c3') },
              { text: t('p4'), chip: t('c4') },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
