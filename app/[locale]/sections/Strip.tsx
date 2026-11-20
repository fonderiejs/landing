'use client';

import { useEffect, useRef } from 'react';

// The row of tools under "We run it". It drifts to the left at 30px a
// second while it is in view, and can be swiped by hand. Each disc is full
// size at the middle of the window and shrinks to 59% at its edges, and the
// discs are moved together as they shrink so that the gap between two
// neighbours stays the same all along the row. The list is repeated so that
// the row never ends; only the first copy is named for screen readers. With
// reduced motion the row stands still and every disc keeps its full size.

type Tool = { name: string; file: string; alt: string };

const COPIES = 5;
const SPEED = 30; // px a second
const SMALL = 0.59; // a disc's size at the edge of the window, as a share of its full size
const LEAD = 4; // the row starts this many px before the first tool reaches the middle

export default function Strip({ tools }: { tools: Tool[] }) {
  const root = useRef<HTMLDivElement>(null);
  const count = tools.length;

  useEffect(() => {
    const row = root.current;
    if (!row) return;
    const cells = Array.from(row.children) as HTMLElement[];
    const discs = cells.map((cell) => cell.firstElementChild as HTMLElement);
    const total = cells.length;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const middle = new Float64Array(total); // where each cell's middle is in the window
    const size = new Float64Array(total); // each disc's size, 0.59 to 1
    const shift = new Float64Array(total); // how far each disc is moved to keep the gaps even
    const order = cells.map((_, k) => k);
    let frame = 0;
    let before = 0;
    let seen = false;
    let held = false;
    let place = 0; // kept apart from scrollLeft, which the browser rounds

    // size every disc by its distance from the middle of the window, then
    // close the gaps the smaller discs would leave, keeping the row still
    // at the middle of the window
    const lay = () => {
      const centre = window.innerWidth / 2;
      const reach = Math.max(centre, 1);
      const disc = discs[0].offsetWidth;
      const gap = cells[0].getBoundingClientRect().width - disc;
      for (let k = 0; k < total; k += 1) {
        const box = cells[k].getBoundingClientRect();
        middle[k] = box.left + box.width / 2;
        const away = Math.min(Math.abs(middle[k] - centre) / reach, 1);
        size[k] = SMALL + (1 - SMALL) * Math.cos((away * Math.PI) / 2);
      }
      order.sort((a, b) => middle[a] - middle[b]);
      shift[order[0]] = 0;
      for (let n = 1; n < total; n += 1) {
        const left = order[n - 1];
        const right = order[n];
        const apart = (disc * (size[left] + size[right])) / 2 + gap;
        shift[right] = shift[left] + apart - (middle[right] - middle[left]);
      }
      // the shift that falls on the middle of the window is taken off every disc
      let still = shift[order[0]];
      for (let n = 0; n < total; n += 1) {
        const here = order[n];
        if (n === total - 1 || middle[here] >= centre) {
          still = shift[here];
          break;
        }
        const next = order[n + 1];
        if (middle[next] >= centre) {
          const span = middle[next] - middle[here];
          const part = span > 0 ? (centre - middle[here]) / span : 0;
          still = shift[here] + part * (shift[next] - shift[here]);
          break;
        }
      }
      for (let k = 0; k < total; k += 1) {
        discs[k].style.scale = String(size[k]);
        discs[k].style.translate = `${shift[k] - still}px 0`;
      }
    };
    // stay inside the middle copies, so there is always more row on both sides
    const wrap = () => {
      const set = cells[0].offsetWidth * count;
      if (row.scrollLeft >= set * 3) {
        row.scrollLeft -= set;
        place -= set;
      } else if (row.scrollLeft < set) {
        row.scrollLeft += set;
        place += set;
      }
    };
    const tick = (now: number) => {
      frame = 0;
      if (seen && !held) {
        const step = before ? (Math.min(100, now - before) / 1000) * SPEED : 0;
        place = Math.abs(place - row.scrollLeft) > 2 ? row.scrollLeft + step : place + step;
        row.scrollTo({ left: place, behavior: 'instant' });
      }
      before = now;
      wrap();
      lay();
      if (seen) frame = window.requestAnimationFrame(tick);
    };
    const run = () => {
      if (!frame) {
        before = 0;
        frame = window.requestAnimationFrame(tick);
      }
    };

    row.scrollLeft = cells[0].offsetWidth * count * 2 - LEAD;
    place = row.scrollLeft;
    if (calm) {
      const onScroll = () => wrap();
      row.addEventListener('scroll', onScroll, { passive: true });
      return () => row.removeEventListener('scroll', onScroll);
    }
    lay();
    const watch = new IntersectionObserver((entries) => {
      seen = entries.some((entry) => entry.isIntersecting);
      if (seen) run();
    });
    watch.observe(row);
    const hold = () => {
      held = true;
    };
    const release = () => {
      held = false;
    };
    const onScroll = () => {
      if (!frame) {
        wrap();
        lay();
      }
    };
    row.addEventListener('pointerdown', hold);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    row.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      watch.disconnect();
      row.removeEventListener('pointerdown', hold);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      row.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [count]);

  return (
    <div className="f-strip mt-8 md:mt-10 overflow-hidden">
      <div className="f-strip__row" ref={root}>
        {Array.from({ length: COPIES }, (_, copy) =>
          tools.map((tool) => (
            <div key={`${copy}-${tool.file}`} className="f-strip__item" aria-hidden={copy > 0 ? true : undefined}>
              <div className="f-strip__disc">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/tools/${tool.file}.svg`} alt={copy === 0 ? tool.alt : ''} width={85} height={85} loading="lazy" draggable={false} />
              </div>
            </div>
          )),
        )}
      </div>
    </div>
  );
}
