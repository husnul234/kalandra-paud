// Kalandra PAUD - Progressive Web App Service Worker
const CACHE_NAME = 'kalandra-pwa-v1.0.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.png',
  '/kalandra_logo.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png'
];

// Install Event: Pre-cache static app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clear old cache versions and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Intelligent Caching Strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests (e.g. Supabase POST/PUT/DELETE)
  if (request.method !== 'GET') {
    return;
  }

  // Ignore browser extensions & API calls to Gemini/Supabase
  if (
    url.protocol.startsWith('chrome-extension') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('generativelanguage.googleapis.com')
  ) {
    return;
  }

  // Navigation requests: Network-first with Cache fallback (App Shell)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match('/');
        return cachedResponse || new Response('Aplikasi Kalandra Offline', {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      })
    );
    return;
  }

  // Static Assets (Images, Icons, Fonts, JS/CSS): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
