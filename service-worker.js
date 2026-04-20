const CACHE_NAME = 'fd-advisor-static-v2';

const APP_ASSETS = [
  '/',
  '/index.html',
  '/chat.html',
  '/compare.html',
  '/booking.html',
  '/css/style.css',
  '/css/chat.css',
  '/css/compare.css',
  '/css/booking.css',
  '/js/pwa.js',
  '/js/puter-init.js',
  '/js/index-ui.js',
  '/js/chat-ui.js',
  '/js/compare-ui.js',
  '/js/booking-ui.js',
  '/js/ai-engine.js',
  '/js/persona-engine.js',
  '/js/cultural-engine.js',
  '/js/fd-data.js',
  '/js/booking.js',
  '/js/voice.js',
  '/data/fd-rates.json',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    await Promise.allSettled(APP_ASSETS.map(async (url) => {
      try {
        const request = new Request(url);
        await cache.add(request);
      } catch (err) {
        // Best-effort cache population keeps install resilient.
      }
    }));

    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key !== CACHE_NAME)
      .map((key) => caches.delete(key)));

    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith((async () => {
    if (request.mode === 'navigate') {
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone());
        }
        return fresh;
      } catch (err) {
        const cachedNav = await caches.match(request, { ignoreSearch: true });
        if (cachedNav) return cachedNav;

        const fallback = await caches.match('/index.html');
        if (fallback) return fallback;

        throw err;
      }
    }

    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const fresh = await fetch(request);
      if (fresh && (fresh.status === 200 || fresh.type === 'opaque')) {
        // Skip caching for non-http(s) schemes (e.g., chrome-extension://)
        if (request.url.startsWith('http')) {
          const cache = await caches.open(CACHE_NAME);
          try {
            cache.put(request, fresh.clone());
          } catch (cacheErr) {
            // Ignore cache errors for special schemes
          }
        }
      }
      return fresh;
    } catch (err) {
      throw err;
    }
  })());
});
