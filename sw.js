const CACHE_NAME = "taxi-calc-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
  // icons kun je hier ook toevoegen:
  // "./icon-192.png",
  // "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Alleen same-origin cachen, Google Maps laten we met rust
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(res => res || fetch(event.request))
    );
  }
});