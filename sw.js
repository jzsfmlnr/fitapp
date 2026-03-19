const CACHE_NAME = 'fitmol-v2';
const STATIC_ASSETS = [
  './index.html',
  './pages/home.html',
  './pages/exercises.html',
  './pages/training.html',
  './pages/plan.html',
  './pages/train.html',
  './pages/analytics.html',
  './pages/routine.html',
  './pages/social.html',
  './pages/profile.html',
  './css/core.css',
  './css/profile.css',
  './css/exercises.css',
  './css/training.css',
  './css/plan.css',
  './css/analytics.css',
  './css/train.css',
  './css/social.css',
  './js/app-core.js',
  './js/app-analytics.js',
  './js/app-exercises.js',
  './js/app-init.js',
  './js/app-plan.js',
  './js/app-profile.js',
  './js/app-social.js',
  './js/app-train.js',
  './js/app-training.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Never cache non-GET requests or Supabase API calls
  if (event.request.method !== 'GET') return;
  if (url.includes('supabase.co')) {
    // Network-first for Supabase API
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
