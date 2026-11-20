import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import SeatButton from '../components/SeatButton';
import Strip from './Strip';

type Item = { t: string; d: string };

// Icons: Phosphor (MIT), in public/images/icons.
const ICONS = ['rocket-launch', 'clipboard-text', 'chat-circle-dots', 'sign-out'];

// The tools the parts are built on, shown once and for one reason: any
// developer the founder hires can take over.
// Marks: simple-icons (CC0); they belong to their owners.
const TOOLS = [
  { name: 'Stripe', file: 'stripe' },
  { name: 'Google', file: 'google' },
  { name: 'PostgreSQL', file: 'postgresql' },
  { name: 'Redis', file: 'redis' },
  { name: 'Mailgun', file: 'mailgun' },
  { name: 'Cloudflare', file: 'cloudflare' },
  { name: 'React', file: 'react' },
  { name: 'Vue', file: 'vuedotjs' },
];

// When it sticks: we run it.
export default async function RunIt() {
  const t = await getTranslations('home.run');
  const c = await getTranslations('common.cta');
  const items = t.raw('items') as Item[];
  return (
    <section className="f-run">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <p className="f-eyebrow">{t('eyebrow')}</p>
        <h2 className="f-display" id="we-run-it">
          <span>{t('title1')}</span> <span>{t('title2')}</span>
        </h2>
        <div className="f-run__act">
          <SeatButton className="f-btn f-btn--dark" />
          <p className="f-status">{t('status')}</p>
        </div>
        <div className="f-cards f-cards--four">
          {items.map((item, k) => (
            <div key={item.t} className="f-card" style={{ ['--f-ico' as string]: `url(/images/icons/${ICONS[k]}.svg)` }}>
              <h3>{item.t}</h3>
              <p>{item.d}</p>
            </div>
          ))}
        </div>
        <div className="f-hire">
          <h3 className="f-hire__title">{t('hireTitle')}</h3>
          <p className="f-hire__text">
            {t('hireText')}{' '}
            <Link className="f-reach" href="/pricing">
              {c('seePricing')}
            </Link>
          </p>
        </div>
      </div>
      <p className="f-strip__label">{t('strip')}</p>
      <Strip tools={TOOLS.map((tool) => ({ ...tool, alt: t('logo', { name: tool.name }) }))} />
    </section>
  );
}
