'use client';

import { useEffect, useRef } from 'react';

// What a step's picture is drawn on. On a phone the picture is laid out 448px
// wide and scaled down to its panel as one piece; this sets the scale, the
// panel's width in whole pixels over 448, and keeps it right when the panel
// changes size. From 768px up the style sheet does not scale the scene and
// the value is not used.
export default function Scene({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const panel = el?.parentElement;
    if (!el || !panel) return;
    const set = () => {
      const width = panel.clientWidth;
      if (width > 0) el.style.setProperty('--f-stage', String(width / 448));
    };
    set();
    const watch = new ResizeObserver(set);
    watch.observe(panel);
    return () => watch.disconnect();
  }, []);

  return (
    <div className="f-demo__scene" ref={root}>
      {children}
    </div>
  );
}
