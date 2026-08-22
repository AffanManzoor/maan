/* ============================================================
   SuperKids — sw.js
   Network-first service worker: always try to fetch the latest
   version when online (so a deploy is never stuck behind a stale
   cache), keep the cache updated as we go, and only fall back to
   the cache when the network genuinely isn't available (offline
   play). Bump CACHE_NAME on any deploy that must reach devices
   with an already-installed worker sooner rather than later.
   ============================================================ */
const CACHE_NAME = 'bloomzoo-v8';
const CORE_ASSETS = [
  './', './index.html', './manifest.json',
  './css/style.css?v=23', './css/games.css?v=23',
  './js/core.js?v=23', './js/audio.js?v=23', './js/characters.js?v=23', './js/covers.js?v=23', './js/shell.js?v=23', './js/app.js?v=23',
  './js/games/math.js?v=23', './js/games/counting.js?v=23', './js/games/sorting.js?v=23', './js/games/jigsaw.js?v=23',
  './js/games/letters.js?v=23', './js/games/shapes.js?v=23', './js/games/memory.js?v=23', './js/games/patterns.js?v=23', './js/games/exam.js?v=23',
  './js/games/buildbear.js?v=23', './js/games/buildsnowman.js?v=23', './js/games/carwash.js?v=23', './js/games/buildcake.js?v=23',
  './js/games/brickbreaker.js?v=23', './js/games/starcatcher.js?v=23', './js/games/balloonpop.js?v=23', './js/games/whackamole.js?v=23',
  './js/games/icecream.js?v=23', './js/games/bubblewrap.js?v=23', './js/games/butterfly.js?v=23', './js/games/piano.js?v=23', './js/games/feedmonster.js?v=23',
  './js/games/pizza.js?v=23', './js/games/rocketrace.js?v=23',
  './js/games/sushi.js?v=23', './js/games/robot.js?v=23', './js/games/spaceexplorer.js?v=23', './js/games/treasure.js?v=23',
  './js/games/cupcake.js?v=23', './js/games/fairygarden.js?v=23', './js/games/fishtank.js?v=23',
  './js/games/balloonride.js?v=23', './js/games/fireworks.js?v=23', './js/games/drumkit.js?v=23',
  './js/games/stickerstudio.js?v=23',
  './js/games/wordmatch.js?v=23', './js/games/soundout.js?v=23', './js/games/littlestory.js?v=23',
  './js/games/raindance.js?v=23', './js/games/kaleidoscope.js?v=23', './js/games/snowglobe.js?v=23',
  './js/games/fruitchop.js?v=23', './js/games/beepath.js?v=23', './js/games/trampoline.js?v=23', './js/games/puppyplay.js?v=23',
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
