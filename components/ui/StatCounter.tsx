'use client';

import { useEffect, useRef, useState } from 'react';

// Splits a stat into the static prefix ("$", "US$ "), the countable
// numeric span (which may itself carry thousand separators, e.g.
// "1,300") and the static suffix (" day", "%", "日"). The numeric span
// is captured as its own group so prefix/suffix are sliced from its
// actual match position - not derived via value.indexOf(digitsOnly),
// which breaks whenever the value has a separator: stripping it from the
// digits-only string means that string no longer appears contiguously in
// the original, indexOf returns -1, and the fallback slice(-1) math
// produces garbage affixes that then get concatenated with the live
// count every frame (e.g. "~1,300" rendering as "~1,30" + count + "300").
const SPLIT = /^(\D*)([\d,]*\d)(\D*)$/;

// Counts the numeric span up from zero once the stat scrolls into view,
// and renders that span in its own element so the number can carry
// weight the unit doesn't. Values with no number at all (e.g. "Day one")
// just render as-is - counting them would be meaningless.
export default function StatCounter({ value, accent = false }: { value: string; accent?: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  // null means "not animating - render the authored number". That's the
  // seed, so the statically exported HTML carries the real value rather
  // than a placeholder 0, which is what stays on screen for anyone whose
  // JS is slow or blocked, for anything reading the page without running
  // scripts (crawlers, link previews), and for any stat the viewer never
  // scrolls far enough to trigger. The count-up needs no rewind to zero:
  // its first animation frame is progress 0, which paints 0 anyway.
  const [count, setCount] = useState<number | null>(null);
  const parts = value.match(SPLIT);

  useEffect(() => {
    if (!parts) return;
    const target = parseInt(parts[2].replace(/,/g, ''), 10);
    if (!Number.isFinite(target)) return;

    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const duration = 700;
        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min(1, (now - start) / duration);
          if (progress < 1) {
            setCount(Math.round(progress * target));
            requestAnimationFrame(tick);
          } else {
            // Land back on null rather than the final count so the last
            // frame is the authored string. toLocaleString() groups by
            // the *browser's* locale, which would render an authored
            // "1,300" as "1.300" for a German visitor - a formatting the
            // copy never chose.
            setCount(null);
          }
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
    // parts is derived from value, so value alone is the real dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const className = `proof__num${accent ? ' proof__num--accent' : ''}`;
  if (!parts) {
    return (
      <p ref={ref} className={className}>
        {value}
      </p>
    );
  }

  const [, prefix, numeric, suffix] = parts;
  return (
    <p ref={ref} className={className}>
      {prefix}
      {/* .numeral is a site-wide block, not a proof-specific one - the
          figures carry their own face and weight while the unit ("day",
          "%", "$") stays in the surrounding type. */}
      <span className="numeral">{count === null ? numeric : count.toLocaleString()}</span>
      {suffix}
    </p>
  );
}
