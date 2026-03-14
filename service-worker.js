const CACHE_NAME = "medterm-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.webmanifest",

  "/database/chapter1.json",
  "/database/chapter2.json",
  "/database/chapter3.json",
  "/database/chapter4.json",
  "/database/chapter5.json",
  "/database/chapter6.json",
  "/database/chapter7.json",
  "/database/chapter8.json",
  "/database/chapter9.json",
  "/database/chapter10.json",
  "/database/chapter11.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
