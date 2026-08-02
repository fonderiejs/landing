// Mobile menu toggle — the only scripted behavior on the page.
(function () {
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.nav__burger');
  if (!nav || !burger) return;

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('nav--open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close when a menu link is tapped or the viewport grows past mobile.
  nav.addEventListener('click', function (e) {
    if (e.target.closest('.nav__menu a')) nav.classList.remove('nav--open');
  });
  matchMedia('(min-width: 768px)').addEventListener('change', function (e) {
    if (e.matches) nav.classList.remove('nav--open');
  });
})();

// Scroll-triggered reveal — fade + rise each [data-reveal] element as it
// enters the viewport. Honors an optional data-delay (ms) for staggering.
(function () {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.setAttribute('data-shown', ''); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(function () { el.setAttribute('data-shown', ''); }, delay);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  els.forEach(function (el) { io.observe(el); });
})();

// Copy-to-clipboard for any install command (hero + timeline + final CTA).
(function () {
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function () {});
      var label = btn.querySelector('[data-copy-label]');
      if (!label) return;
      var prev = label.textContent;
      label.textContent = 'Copied';
      setTimeout(function () { label.textContent = prev; }, 1600);
    });
  });
})();

// Solution section: scroll-synced code reveal. Each AI message carries
// [data-phase-trigger="n"]; when it crosses the viewport center, phase n
// (and any earlier phase not yet shown) reveals in the sticky code panel.
// Phase 1 ships pre-shown in the markup so the panel isn't empty pre-JS.
(function () {
  var triggers = document.querySelectorAll('[data-phase-trigger]');
  var phases = document.querySelectorAll('.lp-codepanel__phase');
  if (!triggers.length || !phases.length) return;

  function showPhase(n) {
    phases.forEach(function (p) {
      var pn = parseInt(p.getAttribute('data-phase'), 10);
      if (pn <= n && !p.hasAttribute('data-shown')) {
        p.classList.add('lp-codepanel__phase--enter');
        p.setAttribute('data-shown', '');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { p.classList.remove('lp-codepanel__phase--enter'); });
        });
      }
      if (pn === n) p.setAttribute('data-active', '');
      else p.removeAttribute('data-active');
    });
  }

  if (!('IntersectionObserver' in window)) {
    phases.forEach(function (p) { p.setAttribute('data-shown', ''); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) showPhase(parseInt(entry.target.getAttribute('data-phase-trigger'), 10));
    });
  }, { threshold: 0, rootMargin: '-40% 0px -40% 0px' });

  triggers.forEach(function (t) { io.observe(t); });
})();

// Theme switcher — same behavior as platform/ui. "System" clears the
// override so prefers-color-scheme takes back over.
(function () {
  var stored = localStorage.getItem('theme');
  var active = stored === 'light' || stored === 'dark' ? stored : 'system';
  document.querySelectorAll('.theme-switch input[name="theme"]').forEach(function (radio) {
    if (radio.value === active) radio.checked = true;
    radio.addEventListener('change', function () {
      if (this.value === 'system') {
        localStorage.removeItem('theme');
        document.documentElement.removeAttribute('data-theme');
      } else {
        localStorage.setItem('theme', this.value);
        document.documentElement.setAttribute('data-theme', this.value);
      }
    });
  });
})();
