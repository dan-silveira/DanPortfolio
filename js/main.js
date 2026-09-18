/* ==========================================================================
   main.js — progressive enhancement only

   Everything here layers on top of a page that already works without it:
   the nav is a plain list of links, and content is readable with JavaScript
   disabled (see the <noscript> fallback in each page's <head>).
   ========================================================================== */

(function () {
  'use strict';

  /* ---- Mobile navigation ------------------------------------------------
     The button owns aria-expanded; CSS keys the panel off .is-open. On
     desktop the panel is always visible and the button is hidden, so the
     open/closed state only matters below the 48rem breakpoint. */

  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');

    if (!toggle || !nav) return;

    // Must match the breakpoint in components.css where the panel goes inline.
    var desktopQuery = window.matchMedia('(min-width: 48rem)');

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('has-nav-open', open);
    }

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    toggle.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    // Escape closes the panel and returns focus to the button that opened it.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Clicking outside the panel dismisses it.
    document.addEventListener('click', function (event) {
      if (!isOpen()) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    // Following a link closes the panel. Matters for same-page anchors, where
    // no navigation occurs to reset the state.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    // Crossing into desktop layout clears the mobile state, so the body scroll
    // lock cannot persist once the panel is no longer an overlay.
    desktopQuery.addEventListener('change', function (event) {
      if (event.matches) setOpen(false);
    });
  }

  /* ---- Active navigation link -------------------------------------------
     Marks the link for the current page with aria-current="page", which also
     drives the persistent underline in components.css. Doing this in one
     place avoids hand-editing a modifier class into every page's header.
     The avatar links to /about/, so it is matched here too; only the text
     links carry the underline. */

  function initActiveLink() {
    var links = document.querySelectorAll('.site-nav__link, .site-header__avatar');
    if (!links.length) return;

    // Normalize to a trailing slash so "/work" and "/work/index.html" both
    // compare equal to "/work/".
    var current = window.location.pathname.replace(/index\.html$/, '');
    if (current.charAt(current.length - 1) !== '/') current += '/';

    Array.prototype.forEach.call(links, function (link) {
      var target = link.getAttribute('href');
      if (!target || target.charAt(0) === '#' || target.indexOf('/#') === 0) return;

      var path = new URL(link.href).pathname.replace(/index\.html$/, '');
      if (path.charAt(path.length - 1) !== '/') path += '/';

      // A section link stays current for its descendants, so /work/ is marked
      // while reading /work/project-one/. The home link is excluded because
      // "/" is a prefix of every path.
      var isMatch = path === current || (path !== '/' && current.indexOf(path) === 0);

      if (isMatch) link.setAttribute('aria-current', 'page');
    });
  }

  /* ---- Header scroll state ----------------------------------------------
     Adds the divider under the sticky header only once the page has scrolled.
     Reads are batched into a rAF so the scroll handler stays cheap. */

  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* ---- Scroll reveal ----------------------------------------------------
     Fades in [data-reveal] elements as they enter the viewport. Bails out to
     showing everything if the user prefers reduced motion or the browser
     lacks IntersectionObserver, so content is never left hidden. */

  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    function revealAll() {
      Array.prototype.forEach.call(items, function (item) {
        item.classList.add('is-visible');
      });
    }

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // reveal once, never re-hide
      });
    }, {
      // Trigger slightly before the element reaches the viewport edge so the
      // animation is already underway when it becomes visible.
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    });

    Array.prototype.forEach.call(items, function (item) {
      observer.observe(item);
    });
  }

  /* ---- Work password gate -----------------------------------------------
     Courtesy overlay on Work pages. The password is not real security; it
     only keeps the case studies from being casually readable. A matching
     inline script in each Work page <head> restores the unlocked state
     from sessionStorage before paint. */

  function initWorkGate() {
    var gate = document.getElementById('work-gate');
    var form = document.getElementById('work-gate-form');
    if (!gate || !form) return;
    if (document.documentElement.classList.contains('work-unlocked')) return;

    var input = document.getElementById('work-gate-password');
    var error = document.getElementById('work-gate-error');

    if (input) input.focus();

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (input.value === 'Silveira') {
        try {
          sessionStorage.setItem('work-unlocked', '1');
        } catch (err) { /* private mode may block storage */ }
        document.documentElement.classList.add('work-unlocked');
        return;
      }
      if (error) error.hidden = false;
      input.value = '';
      input.focus();
    });
  }

  /* ---- Boot -------------------------------------------------------------
     Each feature is isolated so a failure in one cannot stop the others. A
     reveal failure additionally un-hides the content it was managing. */

  function run(name, fn) {
    try {
      fn();
    } catch (error) {
      console.error('[main.js] ' + name + ' failed to initialize:', error);
    }
  }

  run('nav', initNav);
  run('activeLink', initActiveLink);
  run('headerScroll', initHeaderScroll);
  run('workGate', initWorkGate);
  run('reveal', function () {
    try {
      initReveal();
    } catch (error) {
      Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (item) {
        item.classList.add('is-visible');
      });
      throw error;
    }
  });
})();
