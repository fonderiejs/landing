'use client';

import { useEffect } from 'react';

// Mirrors the original static site's home.js: elements marked
// data-reveal start hidden/offset (see [data-reveal] in globals.css)
// and get data-shown added once they scroll into view, which
// triggers the opacity/transform transition.
export default function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not([data-shown])');
    if (!els.length || typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.setAttribute('data-shown', ''));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-shown', '');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
