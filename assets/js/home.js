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
