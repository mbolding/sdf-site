// Minesweeper service worker: serve from cache first, refresh the cache in the background.
// Its scope is ./minesweeper, so it controls only the game; the site's stylesheet and theme
// script are cached with it so the game opens offline.
const CACHE = "minesweeper-v1";
const ASSETS = [
  "./minesweeper.html",
  "./minesweeper-manifest.json",
  "./minesweeper-icons/icon-192.png",
  "./minesweeper-icons/icon-512.png",
  "./minesweeper-icons/maskable-512.png",
  "./minesweeper-icons/apple-touch-icon.png",
  "./minesweeper-icons/favicon-64.png",
  "../style.css",
  "../theme.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k.startsWith("minesweeper-") && k !== CACHE).map((k) => caches.delete(k))))
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
