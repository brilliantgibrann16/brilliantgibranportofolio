/* case.js — case-study pages only.
   Theme toggle (same localStorage contract as index.html), nav glass,
   mobile menu. Nothing else runs on these pages. */

function toggleTheme() {
  var isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

(function () {
  var nav = document.getElementById('nav');
  if (!nav) return;

  /* ── NAV SCROLL GLASS ── */
  window.addEventListener('scroll', function () {
    nav.classList.toggle('nav-scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── MOBILE NAV (840 / 840.02 boundary pair — mirrors index.html) ── */
  var burger = document.getElementById('nav-burger');
  var menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  function setMenu(open) {
    nav.classList.toggle('nav-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  }

  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    setMenu(!nav.classList.contains('nav-open'));
  });

  menu.querySelectorAll('a, button').forEach(function (el) {
    el.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
      setMenu(false);
      burger.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('nav-open') && !nav.contains(e.target)) setMenu(false);
  });

  window.matchMedia('(min-width: 840.02px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });
})();
