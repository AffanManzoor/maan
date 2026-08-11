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
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => { /* offline caching just won't be available */ });
    });
  }

  SKShell.router();
})();
