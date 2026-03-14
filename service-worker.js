const CACHE_NAME = "medterm-v2";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).catch(err => {
      console.error("Cache addAll failed:", err);
    })
  );
  self.skipWaiting();
});

// activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// fetch
self.addEventListener("fetch", event => {
  const req = event.request;

  // تخزين JSON من database
  if (req.url.includes("/database/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        fetch(req)
          .then(res => {
            cache.put(req, res.clone());
            return res;
          })
          .catch(() => caches.match(req))
      )
    );
    return;
  }

  // cache first
  event.respondWith(
    caches.match(req).then(res => {
      return res || fetch(req).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(req, fetchRes.clone());
          return fetchRes;
        });
      });
    })
  );
});
