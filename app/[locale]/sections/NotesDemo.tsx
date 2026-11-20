'use client';

import { useEffect, useRef } from 'react';
import Bars from './Bars';
import { back, clock, during, fade, go, in2, inOut1, out2, place, sizes, write, type Sizes } from './motion';

// The second step's picture. It plays once each time its step becomes the
// current one: four quick notes are typed during the call, then the list of
// what gets built is written over them from the top down, and a bar to ask
// for more shows at the foot. The list is longer than the window, so from
// half way on it scrolls up as it is written and ends on its last rows. When
// the reader moves on to another step the window goes back to empty. With
// reduced motion it shows the finished list at once.

type Row = { kind: 'head' | 'item'; text: string; strong?: boolean };
type Words = { title: string; chip1: string; chip2: string; prompt: string; listening: string; building: string };

export default function NotesDemo({ words, notes, rows }: { words: Words; notes: string[]; rows: Row[] }) {
  const root = useRef<HTMLDivElement>(null);
  const text = notes.join('\n');

  useEffect(() => {
    const el = root.current;
    const step = el?.closest<HTMLElement>('.f-step');
    const panel = el?.closest<HTMLElement>('.f-demo');
    if (!el || !step || !panel) return;
    const find = (name: string) => el.querySelector<HTMLElement>(name) as HTMLElement;
    const prompt = find('.f-win__prompt');
    const typed = find('.f-notes__typed');
    const typedText = typed.firstElementChild as HTMLElement;
    const frame = find('.f-notes__scroll');
    const list = find('.f-notes__list');
    const pill = find('.f-notes__status');
    const listen = find('.f-notes__pill');
    const ask = find('.f-notes__ask');
    const lines = Array.from(list.children) as HTMLElement[];
    const size = text.length;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 768px)');

    // the moments of one play, in seconds
    const HEAR = 0.35; // "Listening" pops in
    const TYPE = HEAR + 0.45; // the notes start
    const TYPED = TYPE + size / 26; // and are all there
    const GONE = TYPED + 0.6; // they fade
    const WRITE = GONE + 0.3; // the list is written, 2.6s
    const WRITTEN = WRITE + 2.6;
    const END = WRITTEN + 0.3;

    let shown = -1;
    let m: Sizes | null = null;

    // the empty window, as before a play and after the reader has moved on
    const empty = () => {
      shown = -1;
      m = null;
      typedText.textContent = '';
      lines.forEach((row) => row.removeAttribute('data-on'));
      frame.scrollTop = 0;
      list.style.clipPath = 'inset(0px 0px 100% 0px)';
      fade(prompt, 1);
      fade(typed, 0);
      fade(list, 0);
      fade(pill, 0);
      place(pill, { sx: 0.95 });
      fade(listen, 0);
      fade(ask, 0);
      el.dataset.phase = 'idle';
    };

    const draw = (t: number) => {
      fade(prompt, 0);
      fade(list, 1);

      // "Listening"
      fade(listen, t < WRITE ? go(t, HEAR, 0.45, 0, 1, back(2.6)) : go(t, WRITE, 0.25, 1, 0, in2));
      place(listen, { sx: t < WRITE ? go(t, HEAR, 0.45, 0.6, 1, back(2.6)) : go(t, WRITE, 0.25, 1, 0.8, in2) }, during(t, [HEAR, 0.45], [WRITE, 0.25]));

      // the notes, a letter at a time, then gone
      const n = Math.round(go(t, TYPE, TYPED - TYPE, 0, size));
      if (n !== shown) {
        shown = n;
        typedText.textContent = text.slice(0, n);
      }
      fade(typed, go(t, GONE, 0.3, 1, 0, in2));

      // the bar to ask for more
      fade(ask, go(t, WRITE + 0.08, 0.42, 0, 1, back(2.2)));
      place(ask, { sx: go(t, WRITE + 0.08, 0.42, 0.72, 1, back(2.2)), sy: go(t, WRITE + 0.08, 0.42, 0.9, 1, back(2.2)) }, during(t, [WRITE + 0.08, 0.42]));

      // the list and the line that writes it
      if (t < WRITE) {
        list.style.clipPath = 'inset(0px 0px 100% 0px)';
        fade(pill, 0);
        place(pill, { y: -8, sx: 0.95 });
      } else {
        if (!m) m = sizes(frame, list, lines);
        const travel = write(go(t, WRITE, 2.6, 0, 1, inOut1), m, frame, list, lines);
        place(pill, { y: travel - 8, sx: go(t, WRITE, 0.28, 0.95, 1, out2) }, during(t, [WRITE, 0.28]));
        fade(pill, t < WRITTEN ? go(t, WRITE, 0.28, 0, 1, out2) : go(t, WRITTEN, 0.3, 1, 0, in2));
      }
      el.dataset.phase = t >= END ? 'done' : 'playing';
    };

    let playing = false;
    const time = clock(
      (t) => {
        draw(t);
        if (t >= END) playing = false;
      },
      () => playing,
    );
    const play = () => {
      time.stop();
      time.reset();
      if (calm) {
        draw(END);
        return;
      }
      playing = true;
      draw(0);
      time.start();
    };
    const stop = () => {
      playing = false;
      time.stop();
      empty();
    };

    // On a wide window the picture plays while its step is the current one
    // (StepsNav says so on the step). On a phone there are no step names and
    // it plays while the picture itself lies across the middle of the window.
    let across = false;
    let current = false;
    const follow = () => {
      const now = wide.matches ? step.hasAttribute('data-current') : across;
      if (now === current) return;
      current = now;
      if (now) play();
      else stop();
    };
    empty();
    const middle = new IntersectionObserver(
      ([entry]) => {
        across = entry.isIntersecting;
        follow();
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    middle.observe(panel);
    const told = new MutationObserver(follow);
    told.observe(step, { attributes: true, attributeFilter: ['data-current'] });
    wide.addEventListener('change', follow);
    return () => {
      time.stop();
      middle.disconnect();
      told.disconnect();
      wide.removeEventListener('change', follow);
    };
  }, [text]);

  return (
    <div className="f-win f-win--side f-notes" ref={root}>
      <div className="f-win__bar">
        <i />
        <i />
        <i />
      </div>
      <div className="f-win__main">
        <div className="f-win__title">{words.title}</div>
        <div className="f-win__meta">
          <span className="f-win__chips">
            <span>{words.chip1}</span>
            <span>{words.chip2}</span>
          </span>
        </div>
        <div className="f-win__body f-notes__body">
          <div className="f-notes__pile">
            <div className="f-notes__layer">
              <p className="f-win__prompt">{words.prompt}</p>
            </div>
            <div className="f-notes__layer">
              <p className="f-notes__typed">
                <span />
                <b className="f-caret" />
              </p>
            </div>
            <div className="f-notes__layer f-notes__scroll">
              <div className="f-notes__pad">
                <div className="f-write f-notes__list">
                  {rows.map((row) => (
                    <p key={`${row.kind}-${row.text}`} className={`f-write__row f-write__row--${row.kind}${row.strong ? ' f-write__row--strong' : ''}`}>
                      {row.kind === 'item' && '•  '}
                      {row.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="f-notes__statusbox">
            <div className="f-status-pill f-notes__status">
              <span className="f-spinner" />
              <span>{words.building}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="f-notes__listen">
        <span className="f-notes__pill">
          <Bars />
          <span>{words.listening}</span>
        </span>
      </div>
      <div className="f-notes__ask">
        <span className="f-notes__field">
          <span>{words.prompt}</span>
          <i>
            <svg viewBox="0 0 11 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5.5 1v11M1 5.5 5.5 1 10 5.5" />
            </svg>
          </i>
        </span>
      </div>
    </div>
  );
}
