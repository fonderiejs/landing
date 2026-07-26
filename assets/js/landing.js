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

// Copy-to-clipboard for the install command in the "How it works" timeline.
(function () {
  var btn = document.querySelector('[data-copy]');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var text = btn.getAttribute('data-copy');
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function () {});
    var label = btn.querySelector('[data-copy-label]');
    if (!label) return;
    var prev = label.textContent;
    label.textContent = 'Copied';
    setTimeout(function () { label.textContent = prev; }, 1600);
  });
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
