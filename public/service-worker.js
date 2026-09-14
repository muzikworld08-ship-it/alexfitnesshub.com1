// ALEX FITNESS HUB Service Worker
// Version: alexfitnesshub-cache-v1

const CACHE_NAME = "alexfitnesshub-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/favicon.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline essentials:", urlsToCache);
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
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => {
          console.log("[Service Worker] Removing old cache:", n);
          return caches.delete(n);
        })
      )
    ).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Let API and WebSocket calls pass directly through to network
  if (event.request.url.includes("/api/") || event.request.url.startsWith("ws:") || event.request.url.startsWith("wss:")) {
    return;
  }

  // Handle standard document navigations and static requests
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache for next time (stale-while-revalidate for static assets)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.method === "GET") {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
        }).catch(() => { /* offline - ignore */ });

        return cachedResponse;
      }

      // If not in cache, fetch from network and cache successful GET responses
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic" || event.request.method !== "GET") {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // If network fails (offline), fallback to index.html for navigation requests
          if (event.request.mode === "navigate" || event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
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
