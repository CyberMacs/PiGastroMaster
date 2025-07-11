const CACHE_NAME = 'gastro-master-v1';

// On install, pre-cache the app shell and other key assets.
self.addEventListener('install', (event) => {
  async function preCache() {
    const cache = await caches.open(CACHE_NAME);
    // Pre-caching the main page and manifest.
    // Other assets will be cached on-demand.
    return cache.addAll([
      '/',
      '/index.html',
      '/manifest.json'
    ]);
  }
  event.waitUntil(preCache());
});

// Clean up old caches on activation.
self.addEventListener('activate', (event) => {
  async function deleteOldCaches() {
    const keys = await caches.keys();
    const promises = keys.map((key) => {
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }
    });
    return Promise.all(promises);
  }
  event.waitUntil(deleteOldCaches());
});

// Use a stale-while-revalidate strategy for fetch events.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Ignore requests to the Gemini API to always fetch fresh data
  if (request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }
  
  async function staleWhileRevalidate() {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
      // Check for a valid response to cache
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }).catch(err => {
        console.error('Fetch failed; returning cached response if available.', err);
    });

    // Return cached response immediately if available, otherwise wait for network
    return cachedResponse || fetchPromise;
  }

  event.respondWith(staleWhileRevalidate());
});
