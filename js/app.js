/* ============================================================
   SuperKids — app.js
   Final bootstrap: warm up speech voices, register the offline
   service worker, and kick off the very first route render.
   (All games have already self-registered by the time this runs,
   since their <script> tags load before this one.)
   ============================================================ */
(function () {
  'use strict';

  if ('speechSynthesis' in window) {
    // Chrome/Edge load voice lists asynchronously — touching it early
    // means the first "read aloud" tap already has a voice ready.
    window.speechSynthesis.getVoices();
  }

  if ('serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:')) {
    // Auto-update: if this page was already running under an older
    // service worker (a returning visit), reload once the moment a
    // newly-deployed worker takes over, so the tab picks up the fix
    // without anyone having to manually hard-refresh. `controllerchange`
    // also fires on a plain first-ever visit (no controller -> first
    // controller), which is NOT an update and must not trigger a
    // reload — that transition is guarded out via hadController below.
    const hadController = !!navigator.serviceWorker.controller;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then((reg) => {
        reg.update().catch(() => { /* ignore — next natural check will retry */ });
        if (hadController) {
          let reloaded = false;
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (reloaded) return;
            reloaded = true;
            window.location.reload();
          });
        }
      }).catch(() => { /* offline caching just won't be available */ });
    });
  }

  SKShell.router();

  /* ---------- ambient home-page details ---------- */
  // Populated once at boot; the layers live in the DOM full-time (fixed position,
  // z-index:0 behind content) and are cheap to animate via pure CSS keyframes.
  // Respects prefers-reduced-motion — the animations themselves are disabled in
  // css/style.css when the user has that OS setting on.
  function seedFloaties() {
    const host = document.getElementById('floaties');
    if (!host) return;
    const EMOJI = ['🎈', '⭐', '💛', '💙', '💗', '🌟', '✨', '🎉', '🌈', '🦋'];
    const COUNT = 14;
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('span');
      el.className = 'floaty';
      el.textContent = EMOJI[Math.floor(Math.random() * EMOJI.length)];
      const leftPct = 4 + Math.random() * 90;
      const dur = 22 + Math.random() * 18;
      const delay = -Math.random() * dur; // negative so mid-animation states appear on load
      const size = 1.1 + Math.random() * 1.4;
      el.style.left = leftPct + '%';
      el.style.animationDuration = dur + 's';
      el.style.animationDelay = delay + 's';
      el.style.fontSize = size + 'rem';
      host.appendChild(el);
    }
  }
  function seedStarfield() {
    const host = document.getElementById('starfield');
    if (!host) return;
    const COUNT = 40;
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('span');
      el.className = 'twinkle';
      const leftPct = Math.random() * 100;
      const topPct = Math.random() * 100;
      const dur = 2.2 + Math.random() * 3;
      const delay = Math.random() * 5;
      const scale = 0.5 + Math.random() * 1.1;
      el.style.left = leftPct + '%';
      el.style.top = topPct + '%';
      el.style.animationDuration = dur + 's';
      el.style.animationDelay = delay + 's';
      el.style.transform = `scale(${scale})`;
      host.appendChild(el);
    }
  }
  function armReveal() {
    // Hard safety net: if IntersectionObserver is unsupported OR doesn't fire for some
    // reason within 3s (rare, but possible on odd viewport heights + browsers), reveal
    // everything so nothing gets stuck invisible below the fold.
    const forceRevealAll = () => {
      document.querySelectorAll('.reveal:not(.revealed), .reveal-stagger:not(.revealed)')
        .forEach((el) => el.classList.add('revealed'));
    };
    if (!('IntersectionObserver' in window)) { forceRevealAll(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    const scan = () => {
      document.querySelectorAll('.reveal:not(.revealed), .reveal-stagger:not(.revealed)').forEach((el) => io.observe(el));
    };
    scan();
    // Re-scan once for elements the router adds after route changes (crew/showcase).
    setTimeout(scan, 400);
    setTimeout(scan, 1500);
    setTimeout(forceRevealAll, 3000);
  }
  function markReveals() {
    // Tag home-page sections/grids for the reveal observer. Skip the hero — it's the
    // first thing users see and shouldn't fade in from below.
    document.querySelectorAll('#screen-home .sec').forEach((sec) => sec.classList.add('reveal'));
    document.querySelectorAll('.free-badge').forEach((el) => el.classList.add('reveal'));
    ['crewGrid', 'showcase', 'gameGrid'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add('reveal-stagger');
    });
    document.querySelectorAll('.why-grid').forEach((el) => el.classList.add('reveal-stagger'));
  }

  seedFloaties();
  seedStarfield();
  markReveals();
  armReveal();
})();
