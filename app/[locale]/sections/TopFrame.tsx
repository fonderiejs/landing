'use client';

import { useSyncExternalStore } from 'react';

// The frame of the first two screens. The card and the editor behind it
// follow the scroll position through the style sheet alone, in browsers
// that can tie an animation to scrolling. For the others this marks the
// frame once the page has left the top, and the editor fades out there.

const subscribe = (notify: () => void) => {
  window.addEventListener('scroll', notify, { passive: true });
  return () => window.removeEventListener('scroll', notify);
};
const scrolled = () => window.scrollY > 0;
const atTop = () => false;

export default function TopFrame({ children }: { children: React.ReactNode }) {
  const away = useSyncExternalStore(subscribe, scrolled, atTop);
  return (
    <div className="f-top" data-scrolled={away ? '' : undefined}>
      {children}
    </div>
  );
}
