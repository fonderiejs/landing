(function () {
  // ---- theme (system / light / dark), persisted in localStorage ----
  var THEME_KEY = 'fonderie-theme';

  function applyTheme(t) {
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }

  function setActiveThemeButton(t) {
    document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
      if (btn.getAttribute('data-theme-btn') === t) btn.setAttribute('data-active', '');
      else btn.removeAttribute('data-active');
    });
  }

  var storedTheme = localStorage.getItem(THEME_KEY) || 'system';
  applyTheme(storedTheme);
  setActiveThemeButton(storedTheme);

  document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var t = btn.getAttribute('data-theme-btn');
      localStorage.setItem(THEME_KEY, t);
      applyTheme(t);
      setActiveThemeButton(t);
    });
  });

  // ---- copy the npx command ----
  var copyBtn = document.querySelector('[data-copy]');
  if (copyBtn) {
    var copyLabel = copyBtn.querySelector('[data-copy-label]');
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(copyBtn.getAttribute('data-copy'));
      if (copyLabel) {
        copyLabel.textContent = 'Copied!';
        setTimeout(function () { copyLabel.textContent = 'Copy'; }, 1600);
      }
    });
  }

  // ---- mobile nav: hamburger opens a bottom-sheet modal ----
  var burger = document.querySelector('.nav__burger');
  var menu = document.querySelector('.mobile-menu');
  if (burger && menu) {
    var lastFocused = null;

    function focusableEls() {
      return Array.prototype.slice.call(
        menu.querySelectorAll('a[href], button:not([disabled])')
      );
    }

    function openMenu() {
      lastFocused = document.activeElement;
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var first = focusableEls()[0];
      if (first) first.focus();
      document.addEventListener('keydown', onKeydown);
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused) lastFocused.focus();
    }

    function onKeydown(e) {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;
      var els = focusableEls();
      if (!els.length) return;
      var first = els[0];
      var last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    burger.addEventListener('click', function () {
      if (menu.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
    menu.querySelectorAll('[data-mobile-menu-close]').forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });
    menu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    matchMedia('(min-width: 768px)').addEventListener('change', function (e) {
      if (e.matches && menu.classList.contains('is-open')) closeMenu();
    });
  }

  // ---- hide any AI-assistant icon that fails to load ----
  document.querySelectorAll('[data-hide-on-error]').forEach(function (img) {
    img.addEventListener('error', function () { img.style.display = 'none'; });
  });

  // ---- scroll-triggered reveal ----
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-shown', '');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.setAttribute('data-shown', ''); });
  }

  // ---- pause the hero cloud animation once it's scrolled out of view ----
  // it's `animation: ... infinite`, so without this it keeps compositing
  // every frame for the entire session, adding constant background cost.
  var heroBackdrop = document.querySelector('.hero__backdrop');
  if (heroBackdrop && 'IntersectionObserver' in window) {
    var bgIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        heroBackdrop.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
    }, { threshold: 0 });
    bgIo.observe(heroBackdrop);
  }
})();
