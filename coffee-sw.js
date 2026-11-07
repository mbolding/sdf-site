// Coffee guide service worker: serve from cache first, refresh the cache in the background.
// It sits at the site root so it can reach style.css, but its scope is ./coffee, so it
// controls only coffee.html.
const CACHE = "coffee-guide-v1";
const ASSETS = [
  "./coffee.html",
  "./apps/coffee/manifest.json",
  "./apps/coffee/icon-192.png",
  "./apps/coffee/icon-512.png",
  "./apps/coffee/maskable-512.png",
  "./apps/coffee/apple-touch-icon.png",
  "./apps/coffee/favicon-64.png",
  "./style.css",
  "./theme.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

// Caches are shared by the whole site, so clear out only this app's old ones.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k.startsWith("coffee-guide-") && k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== location.origin) return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((hit) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});
