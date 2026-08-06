'use client';

import { useEffect, useRef, useState } from 'react';

// Animates a numeric prefix of the value (e.g. "1,300" -> counts the
// 1300, keeps any non-numeric prefix/suffix like "$" or "Day" static)
// once the stat scrolls into view. Non-numeric values (e.g. "Day 1")
// just fade in - counting them up would be meaningless.
export default function StatCounter({ value, accent = false }: { value: string; accent?: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState(() => (/\d/.test(value) ? '0' : value));

  useEffect(() => {
    // Capture the numeric span (which may itself contain thousand
    // separators, e.g. "1,300") as its own group, so prefix/suffix are
    // sliced from its actual match position - not derived via
    // value.indexOf(digitsOnly), which breaks whenever the value has a
    // separator: stripping it from the digits-only string means that
    // string no longer appears contiguously in the original, indexOf
    // returns -1, and the fallback slice(-1) math produces garbage
    // prefix/suffix that then gets concatenated with the live count
    // every frame (e.g. "~1,300" rendering as "~1,30" + count + "300").
    const match = value.match(/^(\D*)([\d,]*\d)(\D*)$/);
    if (!match) return;
    const [, prefix, numeric, suffix] = match;
    const target = parseInt(numeric.replace(/,/g, ''), 10);
    if (!Number.isFinite(target)) return;

    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setDisplay(value);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const duration = 700;
        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min(1, (now - start) / duration);
          const current = Math.round(progress * target);
          setDisplay(`${prefix}${current.toLocaleString()}${suffix}`);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <p ref={ref} className={`proof__num${accent ? ' proof__num--accent' : ''}`}>
      {display}
    </p>
  );
}
