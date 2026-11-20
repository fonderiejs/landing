import { getTranslations } from 'next-intl/server';
import { MAIL } from '@/lib/site';
import SeatButton from '../components/SeatButton';
import IdeaDemo from './IdeaDemo';
import TopFrame from './TopFrame';

// The first two screens. On a wide window the "Your idea" card stays in
// view on the right through the first screen, settling from large to its
// own size, and comes to rest beside the five commitments. On a phone it
// sits under the hero and stays under the bar for a screen.
export default async function Top() {
  const t = await getTranslations('home');
  const i = (key: string) => t(`idea.${key}`);

  return (
    <TopFrame>
      <div className="f-top__stage">
        <section className="f-hero">
          <a className="f-pill" href="#how-it-works">
            <span className="f-pill__badge">{t('hero.badge')}</span>
            <span className="f-pill__text">{t('hero.pill')}</span>
            <svg
              className="f-pill__arrow"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" />
            </svg>
          </a>
          <h1 className="f-hero__title">
            <span>{t('hero.title1')}</span> <span>{t('hero.title2')}</span> <span>{t('hero.title3')}</span>
          </h1>
          <div className="f-hero__copy">
            <p className="f-hero__lead">{t('hero.lead')}</p>
            <p>{t('hero.sub')}</p>
          </div>
          <div className="f-hero__act">
            <SeatButton className="f-btn f-btn--accent" />
            <p className="f-hero__beside">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              <span>{t('hero.beside')}</span>
            </p>
          </div>
        </section>

        <div className="f-top__layer">
          <div className="f-top__clip">
            <div className="f-top__grid">
              <div className="f-top__col">
                <div className="f-top__card">
                  <div className="f-editor" aria-hidden="true" />
                  <IdeaDemo
                    words={{
                      title: i('title'),
                      chip1: i('chip1'),
                      chip2: i('chip2'),
                      start: i('start'),
                      lines: [i('line1'), i('line2'), i('line3'), i('line4')],
                      listening: i('listening'),
                      building: i('building'),
                      tabIdea: i('tabIdea'),
                      tabBuild: i('tabBuild'),
                      list: [
                        { kind: 'head', text: i('doneHead') },
                        { kind: 'item', text: i('done1'), strong: true },
                        { kind: 'sub', text: i('done1a') },
                        { kind: 'head', text: i('paidHead') },
                        { kind: 'item', text: i('paid1'), strong: true },
                        { kind: 'sub', text: i('paid1a') },
                        { kind: 'head', text: i('teamsHead') },
                        { kind: 'item', text: i('teams1'), strong: true },
                        { kind: 'head', text: i('yoursHead') },
                        { kind: 'item', text: i('yours1') },
                        { kind: 'item', text: i('yours2') },
                        { kind: 'item', text: i('yours3') },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="f-proof">
        <span className="f-proof__edge f-proof__edge--left" aria-hidden="true" />
        <span className="f-proof__edge f-proof__edge--right" aria-hidden="true" />
        <div className="f-proof__lines" aria-hidden="true" />
        <h2 className="f-proof__title">{t('proof.title')}</h2>
        <ul className="f-proof__rows">
          <li>
            <span>
              {t('proof.row1a')}
              <strong>{t('proof.row1b')}</strong>
            </span>
          </li>
          <li>
            <span>
              <strong>{t('proof.row2a')}</strong>
              {t('proof.row2b')}
            </span>
          </li>
          <li>
            <span>
              {t('proof.row3a')}
              <strong>{t('proof.row3b1')}</strong>
              {t('proof.row3sep')}
              <strong>{t('proof.row3b2')}</strong>
              {t('proof.row3sep')}
              <strong>{t('proof.row3b3')}</strong>
              {t('proof.row3c')}
            </span>
          </li>
          <li>
            <span>
              {t('proof.row4a')}
              <strong>{t('proof.row4b')}</strong>
            </span>
          </li>
          <li>
            <span>
              {t('proof.row5a')}
              <a className="f-reach" href={`mailto:${MAIL}`}>
                {MAIL}
              </a>
              {t('proof.row5b')}
            </span>
          </li>
        </ul>
      </section>
    </TopFrame>
  );
}
