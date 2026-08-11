/* ============================================================
   SuperKids — sw.js
   Minimal offline-first service worker: cache the app shell on
   install, serve from cache first, fall back to network, and
   fall back to cache again if the network is unavailable.
   ============================================================ */
const CACHE_NAME = 'superkids-v1';
const CORE_ASSETS = [
  './', './index.html', './manifest.json',
  './css/style.css', './css/games.css',
  './js/core.js', './js/audio.js', './js/characters.js', './js/shell.js', './js/app.js',
  './js/games/math.js', './js/games/counting.js', './js/games/sorting.js', './js/games/jigsaw.js',
  './js/games/letters.js', './js/games/shapes.js', './js/games/memory.js', './js/games/patterns.js', './js/games/exam.js',
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
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
