const CACHE = 'maps-v3';
const STATIC = [
  '/mes-photos/',
  '/mes-photos/maps.html',
  '/mes-photos/index.html',
  '/mes-photos/map.js',
  '/mes-photos/styles.css',
  '/mes-photos/auth-social.css',
  '/mes-photos/city-styles.css',
  '/mes-photos/auth.js',
  '/mes-photos/social.js',
  '/mes-photos/firebase-config.js',
  '/mes-photos/icons/icon-192.png',
  '/mes-photos/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
