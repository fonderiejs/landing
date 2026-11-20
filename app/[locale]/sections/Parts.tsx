import { getTranslations } from 'next-intl/server';
import SeatButton from '../components/SeatButton';

type Item = { t: string; d: string };

// Icons: Phosphor (MIT), in public/images/icons.
const ICONS = ['lock', 'credit-card', 'users-three', 'clipboard-text', 'rocket-launch'];

// What you get: the five parts, as numbered cards.
export default async function Parts() {
  const t = await getTranslations('home.parts');
  const items = t.raw('items') as Item[];
  return (
    <section className="f-parts">
      <div className="f-parts__lines" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="f-parts__inner">
        <p className="f-eyebrow">{t('eyebrow')}</p>
        <h2 className="f-display" id="features">
          {t('title')}
        </h2>
        <div className="f-parts__act">
          <SeatButton className="f-btn f-btn--dark" />
        </div>
        <div className="f-cards f-cards--five">
          {items.map((item, k) => (
            <div key={item.t} className="f-card" style={{ ['--f-ico' as string]: `url(/images/icons/${ICONS[k]}.svg)` }}>
              <h3>{item.t}</h3>
              <p>{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
