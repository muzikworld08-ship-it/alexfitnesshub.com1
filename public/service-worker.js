// ALEX FITNESS HUB Service Worker
// Version: alexfitnesshub-cache-v3.1-unified

const CACHE_NAME = "alexfitnesshub-cache-v3.1-unified";
const urlsToCache = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/favicon.png"
];

self.addEventListener("install", (event) => {
  // Activate immediately without waiting for existing tabs to close
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching core offline assets:", urlsToCache);
      return cache.addAll(urlsToCache);
    }).catch((err) => {
      console.warn("[Service Worker] Cache pre-fill error:", err);
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING" || (event.data && event.data.type === "SKIP_WAITING")) {
    self.skipWaiting();
  }
  if (event.data === "CLEAR_CACHE" || (event.data && event.data.type === "CLEAR_CACHE")) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => {
          console.log("[Service Worker] Purging outdated cache:", n);
          return caches.delete(n);
        })
      )
    ).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. Let API and WebSocket calls pass directly through to network without interception
  if (url.pathname.startsWith("/api/") || url.protocol === "ws:" || url.protocol === "wss:") {
    return;
  }

  // 2. Service Worker scripts and Web App Manifest must NEVER be served from cache
  if (
    url.pathname.endsWith("/service-worker.js") ||
    url.pathname.endsWith("/sw.js") ||
    url.pathname.endsWith("/manifest.json")
  ) {
    return;
  }

  // 3. Navigation / Document requests: ALWAYS Network-First
  // Guarantees users always receive the newest HTML and build chunk hashes on page load or reload
  if (
    event.request.mode === "navigate" ||
    event.request.destination === "document" ||
    event.request.headers.get("accept")?.includes("text/html")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cached index.html only when completely offline
          return caches.match("/index.html");
        })
    );
    return;
  }

  // 4. Immutable hashed production assets (/assets/[name]-[hash].js/css)
  // Because Vite hashes content into the filename, Cache-First is fast and safe.
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.method === "GET") {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 5. General static files (icons, images): Stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.method === "GET") {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          /* ignore network errors when fetching in background */
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Push Notification Event Listener for background alerts
self.addEventListener("push", (event) => {
  let data = {
    title: "🏋️ AlexFitnessHub Workout Reminder",
    body: "Time for your scheduled workout session! Let's crush today's physical training.",
    icon: "/icons/icon-192.png",
    badge: "/favicon.png",
    tag: "alexfit-workout-reminder",
    data: { url: "/?view=challenges" }
  };

  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icons/icon-192.png",
    badge: data.badge || "/favicon.png",
    tag: data.tag || "alexfit-workout-reminder",
    data: data.data || { url: "/?view=challenges" },
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      { action: "start", title: "🚀 Start Workout" },
      { action: "dismiss", title: "Dismiss" }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Event Listener
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and broadcast event
      for (const client of clientList) {
        if ("focus" in client) {
          client.postMessage({
            type: "ALEXFIT_NOTIFICATION_CLICKED",
            url: targetUrl
          });
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
