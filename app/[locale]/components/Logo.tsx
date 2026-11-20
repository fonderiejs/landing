import type { CSSProperties } from 'react';

// The Fonderie lockup: nine dots and the name. Each dot has its own grey.
// Where the bar is dark the style sheet draws the mark in the bar's ink
// instead, each dot at the strength given here, so it stays readable.
const DOTS: [number, number, string, number][] = [
  [10, 10, '#1c1c1c', 0.99],
  [40, 10, '#3d3d3d', 0.85],
  [70, 10, '#5c5c5c', 0.71],
  [10, 40, '#4b4b4b', 0.79],
  [40, 40, '#767676', 0.6],
  [70, 40, '#e2e2e2', 0.13],
  [10, 70, '#8f8f8f', 0.49],
  [40, 70, '#e7e7e7', 0.11],
  [70, 70, '#e7e7e7', 0.11],
];

export default function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 5017 1350" role="img" aria-hidden="true" focusable="false">
      <g transform="translate(0,199) scale(11.9)">
        {DOTS.map(([cx, cy, grey, strength]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={10} fill={grey} style={{ '--f-dot': strength } as CSSProperties} />
        ))}
        <text x="104" y="66" fontFamily="Manrope, 'Segoe UI', Helvetica, Arial, sans-serif" fontWeight={800} fontSize={62} letterSpacing={-1.2} fill="#1a1a1a">
          Fonderie
        </text>
      </g>
    </svg>
  );
}
