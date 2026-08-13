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
})();
