/// <reference lib="webworker"/>

const CACHE_NAME = 'quran-focus-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/particles.json',
  // Add paths to icons if needed for offline use
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-16x16.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon.ico',
  'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Sans+Arabic:wght@300;400;600&family=Playfair+Display:wght@300;400;600&family=Scheherazade+New:wght@400;700&display=swap',
  'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js',
  'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
  // Add other essential assets here
];

self.addEventListener('install', event => {
  // Perform install steps
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => console.log('[Service Worker] Installation complete'))
      .catch(error => console.error('[Service Worker] Installation failed:', error))
  );
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  // Clean up old caches if necessary
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  console.log('[Service Worker] Activation complete');
  // Ensure the SW takes control immediately
  // eslint-disable-next-line no-undef
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  console.log('[Service Worker] Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          console.log('[Service Worker] Returning from cache:', event.request.url);
          return response;
        }
        // Not in cache - fetch from network
        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request);
        // Optional: Cache the new resource dynamically
        // .then(networkResponse => {
        //   if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
        //     return networkResponse;
        //   }
        //   const responseToCache = networkResponse.clone();
        //   caches.open(CACHE_NAME)
        //     .then(cache => {
        //       cache.put(event.request, responseToCache);
        //     });
        //   return networkResponse;
        // });
      })
      .catch(error => {
        console.error('[Service Worker] Fetch failed:', error);
        // Optional: Fallback for offline scenario if needed
        // return caches.match('/offline.html'); // Example fallback page
      })
  );
}); 