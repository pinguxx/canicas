const CACHE_NAME = 'canicas-mexicanas-v21';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css?v=20',
  '/audio.js?v=20',
  '/app.js?v=20',
  '/qrcode.min.js?v=20',
  '/feria-bridge.js?v=20',
  '/icon.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.includes('/ws')) {
    return;
  }
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request))
  );
});
