/* ============================================================
   SuperKids — sw.js
   Network-first service worker: always try to fetch the latest
   version when online (so a deploy is never stuck behind a stale
   cache), keep the cache updated as we go, and only fall back to
   the cache when the network genuinely isn't available (offline
   play). Bump CACHE_NAME on any deploy that must reach devices
   with an already-installed worker sooner rather than later.
   ============================================================ */
const CACHE_NAME = 'bloomzoo-v7';
const CORE_ASSETS = [
  './', './index.html', './manifest.json',
  './css/style.css?v=22', './css/games.css?v=22',
  './js/core.js?v=22', './js/audio.js?v=22', './js/characters.js?v=22', './js/covers.js?v=22', './js/shell.js?v=22', './js/app.js?v=22',
  './js/games/math.js?v=22', './js/games/counting.js?v=22', './js/games/sorting.js?v=22', './js/games/jigsaw.js?v=22',
  './js/games/letters.js?v=22', './js/games/shapes.js?v=22', './js/games/memory.js?v=22', './js/games/patterns.js?v=22', './js/games/exam.js?v=22',
  './js/games/buildbear.js?v=22', './js/games/buildsnowman.js?v=22', './js/games/carwash.js?v=22', './js/games/buildcake.js?v=22',
  './js/games/brickbreaker.js?v=22', './js/games/starcatcher.js?v=22', './js/games/balloonpop.js?v=22', './js/games/whackamole.js?v=22',
  './js/games/icecream.js?v=22', './js/games/bubblewrap.js?v=22', './js/games/butterfly.js?v=22', './js/games/piano.js?v=22', './js/games/feedmonster.js?v=22',
  './js/games/pizza.js?v=22', './js/games/rocketrace.js?v=22',
  './js/games/sushi.js?v=22', './js/games/robot.js?v=22', './js/games/spaceexplorer.js?v=22', './js/games/treasure.js?v=22',
  './js/games/cupcake.js?v=22', './js/games/fairygarden.js?v=22', './js/games/fishtank.js?v=22',
  './js/games/balloonride.js?v=22', './js/games/fireworks.js?v=22', './js/games/drumkit.js?v=22',
  './js/games/stickerstudio.js?v=22',
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
