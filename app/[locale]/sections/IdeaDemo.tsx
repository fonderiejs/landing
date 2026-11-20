'use client';

import { useEffect, useRef } from 'react';
import Bars from './Bars';
import { back, clock, during, fade, go, in1, in2, inOut3, out2, place, sizes, write, type Sizes } from './motion';

// The "Your idea" card. A founder's four plain lines are there, the last one
// being typed while Fonderie listens. "Get me started" is pressed, and what
// gets built is written over the notes from the top down, a line at a time.
// The line that does the writing then drops to the foot and turns into the
// two tabs, the mark slides back to "Your idea", and it starts again. It
// runs while the card is in view. It is a picture, hidden from screen
// readers: the same facts are in the page's text. With reduced motion it
// shows the finished list and stays there.
//
// The mark on "Get me started" is the sparkles drawing from Heroicons (MIT
// licence).

type Row = { kind: 'head' | 'item' | 'sub'; text: string; strong?: boolean };
type Words = {
  title: string;
  chip1: string;
  chip2: string;
  start: string;
  lines: string[];
  listening: string;
  building: string;
  tabIdea: string;
  tabBuild: string;
  list: Row[];
};

export default function IdeaDemo({ words }: { words: Words }) {
  const root = useRef<HTMLDivElement>(null);
  const last = words.lines.length - 1;
  const line = words.lines[last];

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const find = (name: string) => el.querySelector<HTMLElement>(name) as HTMLElement;
    const typed = find('.f-idea__typed');
    const frame = find('.f-idea__scroll');
    const list = find('.f-idea__list');
    const pill = find('.f-idea__status');
    // each part at the foot sits in a slot of its own: the slot is what is shown, sized and moved
    const [listen, start, tabs] = Array.from(find('.f-idea__foot').children) as HTMLElement[];
    const mark = find('.f-idea__mark');
    const rows = Array.from(list.children) as HTMLElement[];
    const letters = Array.from(line);
    const size = letters.length;

    // the moments of one round, in seconds
    const TYPE = 0.3; // the fourth line starts
    const TYPED = TYPE + size / 26; // and is all there
    const HEARD = TYPED + 0.25 + 0.12; // "Listening" leaves
    const ASK = HEARD + 0.08; // "Get me started" pops in
    const PRESS = Math.max(HEARD + 0.25, ASK + 0.38) + 0.18; // is pressed
    const RELEASE = PRESS + 0.1;
    const LEAVE = RELEASE + 0.12 + 0.05; // and drops away
    const WRITE = LEAVE + 0.35; // the list is written, 3.1s
    const LAND = WRITE + 3.1; // the writing line drops to the foot
    const MELT = LAND + 0.42; // and gives way to the tabs
    const TABS = LAND + 0.4;
    const SWITCH = Math.max(LAND + 0.5, MELT + 0.22, TABS + 0.4) + 0.45; // the mark slides back
    const CLEAR = SWITCH + 0.28; // the list goes, the notes are as at the start
    const ROUND = CLEAR + 0.12;

    let round = -1;
    let shown = -1;
    let m: Sizes | null = null;
    let land: { from: number; to: number; narrow: number } | null = null;

    const draw = (seconds: number) => {
      const now = Math.floor(seconds / ROUND);
      const t = seconds - now * ROUND;
      if (now !== round) {
        // a new round: nothing written yet
        round = now;
        m = null;
        land = null;
        rows.forEach((row) => row.removeAttribute('data-on'));
        frame.scrollTop = 0;
        list.style.clipPath = 'inset(0px 0px 100% 0px)';
      }

      // the fourth line, a letter at a time
      const n = t < TYPE || t >= CLEAR ? 0 : t >= TYPED ? size : Math.round((size - 1) * ((t - TYPE) / (TYPED - TYPE))) + 1;
      if (n !== shown) {
        shown = n;
        typed.textContent = letters.slice(0, n).join('');
      }

      // "Listening"
      fade(listen, t < HEARD ? go(t, 0.04, 0.45, 0, 1, back(2.6)) : go(t, HEARD, 0.25, 1, 0, in2));
      place(listen, { sx: t < HEARD ? go(t, 0.04, 0.45, 0.6, 1, back(2.6)) : go(t, HEARD, 0.25, 1, 0.8, in2) });

      // "Get me started": in, pressed, released, away
      fade(start, t < LEAVE ? go(t, ASK, 0.38, 0, 1, back(2.2)) : go(t, LEAVE, 0.35, 1, 0, in2));
      const pressed =
        t < PRESS ? go(t, ASK, 0.38, 0.8, 1, back(2.2)) : t < RELEASE ? go(t, PRESS, 0.1, 1, 0.96, in2) : t < LEAVE ? go(t, RELEASE, 0.12, 0.96, 1, out2) : go(t, LEAVE, 0.35, 1, 0.85, in2);
      place(start, { y: go(t, LEAVE, 0.35, 0, 28, in2), sx: pressed });

      // the tabs: hidden until the writing line has landed; the mark starts under "What we build".
      // They alone get a layer of their own while they pop in: with one, the browser draws their
      // small words the way this card was designed. The other parts stay flat, or the list
      // above them is drawn soft.
      fade(tabs, t < TABS ? 0 : go(t, TABS, 0.4, 0, 1, back(1.8)));
      place(tabs, { sx: t < TABS ? go(t, 0, 0.18, 0.88, 0.85, in2) : go(t, TABS, 0.4, 0.88, 1, back(1.8)) }, during(t, [0, 0.18], [TABS, 0.4]));
      place(mark, { shift: go(t, SWITCH, 0.28, 100, 0, inOut3) });

      // the list and the line that writes it
      fade(list, t >= CLEAR ? 0 : 1);
      if (t < WRITE) {
        fade(pill, 0);
        return;
      }
      if (!m) m = sizes(frame, list, rows);
      const travel = write(go(t, WRITE, 3.1, 0, 1, in1), m, frame, list, rows);
      let y = travel - 8;
      if (!land && t >= LAND - 0.05) {
        // where the tabs are, counted in the card's own pixels whatever size the card is shown at
        place(pill, { y });
        const here = pill.getBoundingClientRect();
        const there = tabs.getBoundingClientRect();
        const shownAt = pill.offsetHeight ? here.height / pill.offsetHeight : 1;
        const end = Math.max(0, m.frame - (m.all - m.list)) - 8;
        land = { from: end, to: y + (there.top + there.height / 2 - (here.top + here.height / 2)) / shownAt, narrow: Math.max(0.7, there.width / here.width) };
      }
      if (land && t >= LAND) y = go(t, LAND, 0.5, land.from, land.to, out2);
      const grow = go(t, WRITE, 0.28, 0.95, 1, out2);
      const narrow = land ? go(t, MELT, 0.22, 1, land.narrow, in2) : 1;
      place(pill, { y, sx: grow * narrow, sy: grow });
      fade(pill, t < MELT ? go(t, WRITE, 0.28, 0, 1, out2) : go(t, MELT, 0.22, 1, 0, in2));
      // for the tests: the round is at rest while the tabs stand and the mark has not moved yet
      el.dataset.phase = t >= TABS + 0.4 && t < SWITCH ? 'done' : 'playing';
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // no motion: the finished card, drawn once
      draw(SWITCH - 0.01);
      return;
    }
    let seen = false;
    const time = clock(draw, () => seen);
    draw(0);
    const watch = new IntersectionObserver(
      ([entry]) => {
        seen = entry.isIntersecting;
        if (seen) time.start();
      },
      { rootMargin: '100px' },
    );
    watch.observe(el);
    return () => {
      watch.disconnect();
      time.stop();
    };
  }, [line]);

  return (
    <div className="f-idea" ref={root} aria-hidden="true">
      <div className="f-idea__bar">
        <i />
        <i />
        <i />
      </div>
      <div className="f-idea__main">
        <div className="f-idea__title">{words.title}</div>
        <div className="f-idea__meta">
          <span className="f-idea__chips">
            <span>{words.chip1}</span>
            <span>{words.chip2}</span>
          </span>
        </div>
        <div className="f-idea__body">
          <div className="f-idea__pile">
            <div className="f-idea__sheet">
              <div className="f-idea__notes">
                {words.lines.map((text, k) =>
                  k < last ? (
                    <p key={text}>{text}</p>
                  ) : (
                    <p key={text}>
                      <span className="f-idea__typed" />
                      <b className="f-caret" />
                    </p>
                  ),
                )}
              </div>
            </div>
            <div className="f-idea__sheet f-idea__scroll">
              <div className="f-idea__pad">
                <div className="f-idea__list">
                  {words.list.map((row) => (
                    <p key={`${row.kind}-${row.text}`} className={`f-write__row f-write__row--${row.kind}${row.strong ? ' f-write__row--strong' : ''}`}>
                      {row.kind === 'item' && '•  '}
                      {row.kind === 'sub' && '–  '}
                      {row.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="f-idea__statusbox">
            <div className="f-idea__status">
              <span className="f-spinner" />
              <span>{words.building}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="f-idea__foot">
        <span>
          <span className="f-idea__listen">
            <Bars />
            <span>{words.listening}</span>
          </span>
        </span>
        <span>
          <span className="f-idea__start">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
            </svg>
            {words.start}
          </span>
        </span>
        <span>
          <span className="f-idea__tabs">
            <i className="f-idea__mark" />
            <span>{words.tabIdea}</span>
            <span>{words.tabBuild}</span>
          </span>
        </span>
      </div>
    </div>
  );
}
