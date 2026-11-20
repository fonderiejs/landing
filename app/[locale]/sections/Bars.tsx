import type { CSSProperties } from 'react';

// Three bars that move while Fonderie listens. Each is two halves that part
// and meet again, at its own height, reach and pace.
const BARS = [
  { height: 12, reach: 4, time: 0.6, wait: 0 },
  { height: 18, reach: 5, time: 0.5, wait: 0.18 },
  { height: 13, reach: 2.5, time: 0.92, wait: 0.33 },
];

export default function Bars() {
  return (
    <span className="f-bars">
      {BARS.map((bar) => (
        <span
          key={bar.time}
          style={{ height: bar.height + 2 * bar.reach, '--f-bar': `${bar.height}px`, '--f-reach': `${bar.reach}px`, '--f-time': `${bar.time}s`, '--f-wait': `${bar.wait}s` } as CSSProperties}
        >
          <i />
          <i />
        </span>
      ))}
    </span>
  );
}
