'use client';

import { useEffect, useRef, useState } from 'react';

// The three step names beside the steps on a wide window. The current step
// is the last one that crossed the middle of the window; its name is dark.
// The line under each name fills as its step is read: that follows the
// scroll position through the style sheet, in browsers that can tie an
// animation to scrolling (the others show no lines). When the reader moves
// on, the line of the step left behind turns grey and empties to the right.
// A press makes that step the current one and scrolls it to the middle.
// Each step is told whether it is the current one (data-current), which is
// what starts the second step's picture on a wide window.
export default function StepsNav({ labels }: { labels: string[] }) {
  const [active, setActive] = useState(0);
  const quiet = useRef(0); // after a press, scrolling past other steps does not change the current one until this time

  useEffect(() => {
    const steps = Array.from(document.querySelectorAll<HTMLElement>('.f-step'));
    if (steps.length === 0) return;
    const watch = new IntersectionObserver(
      (entries) => {
        if (performance.now() < quiet.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    steps.forEach((step) => watch.observe(step));
    return () => watch.disconnect();
  }, []);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>('.f-step').forEach((step) => {
      step.toggleAttribute('data-current', Number(step.dataset.step) === active);
    });
  }, [active]);

  return (
    <div className="f-steps__nav">
      <div className="f-steps__tabs">
        {labels.map((label, k) => (
          <button
            key={label}
            type="button"
            data-active={k === active ? '' : undefined}
            onClick={() => {
              const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              setActive(k);
              quiet.current = performance.now() + 900;
              document.querySelector<HTMLElement>(`.f-step[data-step="${k}"]`)?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
            }}
          >
            {label}
            <span className="f-steps__line" aria-hidden="true">
              <i className="f-steps__fill" data-step={k} data-passed={k < active ? '' : undefined} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
