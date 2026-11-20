import { getTranslations } from 'next-intl/server';
import StepsNav from './StepsNav';
import NotesDemo from './NotesDemo';
import Scene from './Scene';

// How it works: three steps, each with a picture of the same window. On a
// wide window the three names stay on the left and mark the step in view.
// The first picture is the empty window and what we heard on the call; the
// second types the notes and writes the list as the reader scrolls; the
// third is the finished list and the three things left for the founder.
// The four small drawings are from Lucide (ISC licence): feather,
// list-checks, mail and pencil-line.
// Words that end in a space, handed over as two pieces: the words, then the space. A browser
// measures each piece of text on its own and rounds it, so the bold words that follow sit 1/64 of
// a pixel away when the space is part of the piece before it. The design this page follows cuts
// the line this way.
const cut = (text: string) => (text.endsWith(' ') ? [text.slice(0, -1), ' '] : [text]);

export default async function Steps() {
  const t = await getTranslations('home.steps');

  type Row = { kind: 'head' | 'item'; text: string; strong?: boolean };
  // the two rows in dark ink are the ones the founder asked for by name
  const rows: Row[] = [
    { kind: 'head', text: t('g1') },
    { kind: 'item', text: t('g1a'), strong: true },
    { kind: 'item', text: t('g1b') },
    { kind: 'item', text: t('g1c') },
    { kind: 'head', text: t('g2') },
    { kind: 'item', text: t('g2a') },
    { kind: 'item', text: t('g2b') },
    { kind: 'item', text: t('g2c'), strong: true },
    { kind: 'head', text: t('g3') },
    { kind: 'item', text: t('g3a') },
    { kind: 'item', text: t('g3b') },
    { kind: 'item', text: t('g3c') },
    { kind: 'head', text: t('g4') },
    { kind: 'item', text: t('g4a') },
    { kind: 'item', text: t('g4b') },
    { kind: 'item', text: t('g4c') },
  ];

  const frame = (children: React.ReactNode) => (
    <div className="f-win">
      <div className="f-win__bar">
        <i />
        <i />
        <i />
      </div>
      <div className="f-win__main">
        <div className="f-win__title">{t('winTitle')}</div>
        <div className="f-win__meta">
          <span className="f-win__chips">
            <span>{t('winChip1')}</span>
            <span>{t('winChip2')}</span>
          </span>
        </div>
        <div className="f-win__body">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="f-steps-wrap">
      <h2 className="f-steps__title" id="how-it-works">
        {t('title')}
      </h2>
      <section className="f-steps">
        <StepsNav labels={[t('tab1'), t('tab2'), t('tab3')]} />
        <div className="f-steps__list">
          <article className="f-step" data-step="0">
            <p className="f-step__label">{t('tab1')}</p>
            <h3 className="f-step__title">{t('s1Title')}</h3>
            <p className="f-step__text">{t('s1Text')}</p>
            <div className="f-demo" aria-hidden="true">
              <Scene>
                {frame(<p className="f-win__prompt">{t('winPrompt')}</p>)}
                <div className="f-heard">
                  <p className="f-heard__label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={5 / 3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z" />
                      <path d="M16 8 2 22" />
                      <path d="M17.5 15H9" />
                    </svg>
                    {t('heard')}
                  </p>
                  <p className="f-heard__text">
                    {cut(t('heardA'))}
                    <strong>{t('heardB')}</strong>
                    {cut(t('heardC'))}
                    <strong>{t('heardD')}</strong>
                    {t('heardE')}
                  </p>
                  <ul>
                    <li>
                      <span>{t('heard1')}</span>
                    </li>
                    <li>
                      <span>{t('heard2')}</span>
                    </li>
                    <li>
                      <span>{t('heard3')}</span>
                    </li>
                  </ul>
                </div>
              </Scene>
            </div>
          </article>

          <article className="f-step" data-step="1">
            <p className="f-step__label">{t('tab2')}</p>
            <h3 className="f-step__title">{t('s2Title')}</h3>
            <p className="f-step__text">{t('s2Text')}</p>
            <div className="f-demo" aria-hidden="true">
              <Scene>
                <div className="f-demo__mid">
                  <NotesDemo
                    words={{ title: t('winTitle'), chip1: t('winChip1'), chip2: t('winChip2'), prompt: t('winPrompt'), listening: t('listening'), building: t('building') }}
                    notes={[t('note1'), t('note2'), t('note3'), t('note4')]}
                    rows={rows}
                  />
                </div>
              </Scene>
            </div>
          </article>

          <article className="f-step" data-step="2">
            <p className="f-step__label">{t('tab3')}</p>
            <h3 className="f-step__title">{t('s3Title')}</h3>
            <p className="f-step__text">{t('s3Text')}</p>
            <div className="f-demo" aria-hidden="true">
              <Scene>
                {frame(
                  <div className="f-write f-write--on">
                    {rows.map((row) => (
                      <p key={`${row.kind}-${row.text}`} className={`f-write__row f-write__row--${row.kind}${row.strong ? ' f-write__row--strong' : ''}`}>
                        {row.kind === 'item' && '• '}
                        {row.text}
                      </p>
                    ))}
                  </div>,
                )}
                <div className="f-ours">
                  <p>
                    <span className="f-ours__ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={30 / 26} strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 17 2 2 4-4" />
                        <path d="m3 7 2 2 4-4" />
                        <path d="M13 6h8" />
                        <path d="M13 12h8" />
                        <path d="M13 18h8" />
                      </svg>
                    </span>
                    {t('run1')}
                  </p>
                  <p>
                    <span className="f-ours__ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={30 / 26} strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    {t('run2')}
                  </p>
                  <p>
                    <span className="f-ours__ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={30 / 26} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
                        <path d="m15 5 3 3" />
                      </svg>
                    </span>
                    {t('run3')}
                  </p>
                </div>
              </Scene>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
