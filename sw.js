/* ============================================================
   SuperKids — sw.js
   Network-first service worker: always try to fetch the latest
   version when online (so a deploy is never stuck behind a stale
   cache), keep the cache updated as we go, and only fall back to
   the cache when the network genuinely isn't available (offline
   play). Bump CACHE_NAME on any deploy that must reach devices
   with an already-installed worker sooner rather than later.
   ============================================================ */
const CACHE_NAME = 'superkids-v12';
const CORE_ASSETS = [
  './', './index.html', './manifest.json',
  './css/style.css?v=13', './css/games.css?v=13',
  './js/core.js?v=13', './js/audio.js?v=13', './js/characters.js?v=13', './js/covers.js?v=13', './js/shell.js?v=13', './js/app.js?v=13',
  './js/games/math.js?v=13', './js/games/counting.js?v=13', './js/games/sorting.js?v=13', './js/games/jigsaw.js?v=13',
  './js/games/letters.js?v=13', './js/games/shapes.js?v=13', './js/games/memory.js?v=13', './js/games/patterns.js?v=13', './js/games/exam.js?v=13',
  './js/games/buildbear.js?v=13', './js/games/buildsnowman.js?v=13', './js/games/carwash.js?v=13', './js/games/buildcake.js?v=13',
  './js/games/brickbreaker.js?v=13', './js/games/starcatcher.js?v=13', './js/games/balloonpop.js?v=13', './js/games/whackamole.js?v=13',
  './js/games/icecream.js?v=13', './js/games/bubblewrap.js?v=13', './js/games/butterfly.js?v=13', './js/games/piano.js?v=13', './js/games/feedmonster.js?v=13',
  './assets/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => { /* best effort — first run may be offline-less anyway */ })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then((res) => {
      if (res && res.status === 200 && res.type === 'basic') {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      }
      return res;
    }).catch(() => caches.match(event.request))
  );
});
