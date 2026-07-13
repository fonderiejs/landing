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
