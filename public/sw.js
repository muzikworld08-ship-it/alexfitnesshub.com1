// Production Service Worker for ALEXFITNESSHUB
// Version: 2.5.0-20260728-FORCE-CACHE-PURGE

const CACHE_NAME = "alex-fitness-hub-v2.5.0-20260728";

self.addEventListener("install", (event) => {
  // Activate updated service worker immediately without waiting
  self.skipWaiting();
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING" || (event.data && event.data.type === "SKIP_WAITING")) {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  // Take control of all open client windows immediately and purge every stale cache bucket
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          console.log("[Service Worker] Permanently purging legacy cache bucket:", key);
          return caches.delete(key);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Always fetch HTML documents directly from server with no-cache guarantees
  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(
      fetch(event.request, { cache: "no-store" }).catch(() => {
        return fetch(event.request);
      })
    );
    return;
  }

  // Network-first strategy for dynamic asset and API requests to ensure fresh content across mobile & desktop
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
