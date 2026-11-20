'use client';

import { useEffect, useRef, useState } from 'react';

// A request typed to an AI assistant, and the part it reaches for. Four
// requests in turn. Nothing is typed until most of the card is in view;
// then the request is typed a letter at a time, rests with a blinking
// caret, is shown selected for a moment, and gives way to the next one,
// whose part pops in. If the card leaves the view the text is cleared and
// typed again when it comes back. Screen readers get the whole sentence;
// the typing is for the eye. With reduced motion the first request is
// shown complete and stays.
//
// The six drawings are from Lucide (ISC licence): users, user, user-plus,
// phone, paperclip and sliders-horizontal.

type Prompt = { text: string; chip: string };
type Phase = 'typing' | 'resting' | 'picked';

const START = 400; // from coming into view to the first letter, in ms
const LETTER = 45; // between two letters
const SETTLE = 300; // from the last letter to the caret's first blink
const REST = 2400; // the finished request stays this long
const PICKED = 650; // and is shown selected this long before the next one
const SHARE = 0.6; // how much of the card has to be in view

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

// the colour behind each part's drawing, and the drawing
const TILES = ['#ff9a6f', '#f4cda5', '#d9c7ee', '#bdd7f0'];
const Users = () => (
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
);
const User = () => (
  <>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>
);
const UserPlus = () => (
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </>
);
const Phone = () => (
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
);
const DRAWINGS = [Users, User, UserPlus, Phone];

export default function CastPrompt({ prompts }: { prompts: Prompt[] }) {
  const root = useRef<HTMLDivElement>(null);
  const next = useRef(0); // the timer that moves a finished request on
  const inView = useRef(false);
  const [seen, setSeen] = useState(false);
  const [turn, setTurn] = useState({ index: 0, pop: false });
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');
  const sizes = prompts.map((p) => p.text.length).join(',');
  const { index, pop } = turn;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const watch = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        setSeen(entry.isIntersecting);
      },
      { threshold: SHARE },
    );
    watch.observe(el);
    return () => {
      watch.disconnect();
      window.clearTimeout(next.current);
    };
  }, []);

  useEffect(() => {
    const lengths = sizes.split(',').map(Number);
    let live = true;
    (async () => {
      await wait(0);
      if (!live) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // no motion: the first request, complete
        setTyped(lengths[0]);
        return;
      }
      setTyped(0);
      if (!seen) return;
      await wait(START);
      for (let n = 1; n <= lengths[index]; n += 1) {
        if (!live) return;
        setTyped(n);
        if (n < lengths[index]) await wait(LETTER);
      }
      await wait(SETTLE);
      if (!live) return;
      // typed to the end while in view: rest, show it selected, move on.
      // From here the request runs its course even if the card leaves the view.
      window.clearTimeout(next.current);
      setPhase('resting');
      next.current = window.setTimeout(() => {
        setPhase('picked');
        next.current = window.setTimeout(() => {
          setTurn((now) => ({ index: (now.index + 1) % lengths.length, pop: inView.current }));
          setTyped(0);
          setPhase('typing');
        }, PICKED);
      }, REST);
    })();
    return () => {
      live = false;
    };
  }, [sizes, index, seen]);

  const prompt = prompts[index];
  const Drawing = DRAWINGS[index % DRAWINGS.length];

  return (
    <div className="f-prompt" ref={root}>
      <p className="f-prompt__text">
        <span className="f-sr">{prompt.text}</span>
        <span className="f-prompt__typed" data-picked={phase === 'picked' ? '' : undefined} aria-hidden="true">
          {Array.from(prompt.text.slice(0, typed), (letter, k) => (
            <span key={k}>{letter}</span>
          ))}
        </span>
        <span className="f-prompt__caret" data-rest={phase === 'resting' ? '' : undefined} data-picked={phase === 'picked' ? '' : undefined} aria-hidden="true" />
      </p>
      <div className="f-prompt__chip" data-pop={pop ? '' : undefined} key={index} aria-hidden="true">
        <span className="f-prompt__ico" style={{ background: TILES[index % TILES.length] }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={5 / 3} strokeLinecap="round" strokeLinejoin="round">
            <Drawing />
          </svg>
        </span>
        <span>{prompt.chip}</span>
      </div>
      <div className="f-prompt__tools" aria-hidden="true">
        <span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </span>
        <span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="21" x2="14" y1="4" y2="4" />
            <line x1="10" x2="3" y1="4" y2="4" />
            <line x1="21" x2="12" y1="12" y2="12" />
            <line x1="8" x2="3" y1="12" y2="12" />
            <line x1="21" x2="16" y1="20" y2="20" />
            <line x1="12" x2="3" y1="20" y2="20" />
            <line x1="14" x2="14" y1="2" y2="6" />
            <line x1="8" x2="8" y1="10" y2="14" />
            <line x1="16" x2="16" y1="18" y2="22" />
          </svg>
        </span>
      </div>
    </div>
  );
}
