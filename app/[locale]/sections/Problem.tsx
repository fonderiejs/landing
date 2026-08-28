import { useTranslations } from 'next-intl';
import Numerals from '@/components/ui/Numerals';
import { Row, Col } from '@/components/ui/Grid';

// Phosphor Icons (regular), phosphoricons.com — MIT. Order matches the
// problem.items array in every locale: logins, payments, team invites,
// email, security.
const PAIN_ICON_PATHS = [
  // lock
  'M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z',
  // credit-card
  'M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V88H32V64Zm0,128H32V104H224v88Zm-16-24a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h32A8,8,0,0,1,208,168Zm-64,0a8,8,0,0,1-8,8H120a8,8,0,0,1,0-16h16A8,8,0,0,1,144,168Z',
  // users-three
  'M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z',
  // envelope-simple
  'M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z',
  // shield-check
  'M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z',
];

export default function Problem() {
  const t = useTranslations('problem');
  const items = t.raw('items') as { title: string; text: string }[];

  return (
    <section className="problem">
      <Row
        gutter="clamp(28px, 4vw, 48px)"
        align="start"
        className="problem__grid"
      >
        {/* Left column: copy only */}
        <Col span={6} className="problem__copy" data-reveal>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="section-title section-title--sm">{t('title')}</h2>
          <p className="problem__lede">
            <Numerals>{t('lede')}</Numerals>
          </p>
        </Col>

        {/* Right column: pain cards in a 2-column grid — icon top-left, numeral badge top-right */}
        <Col span={6} className="problem__cards" data-reveal>
        {items.map((item, i) => (
          <div key={item.title} className="pain-card">
            <div className="pain-card__head">
              <svg
                className="pain-card__icon"
                viewBox="0 0 256 256"
                width={24}
                height={24}
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={PAIN_ICON_PATHS[i]} />
              </svg>
              <span className="pain-card__badge">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div>
              <h3 className="pain-card__title">{item.title}</h3>
              <p className="pain-card__text">
                <Numerals>{item.text}</Numerals>
              </p>
            </div>
          </div>
        ))}
        </Col>
      </Row>
    </section>
  );
}
