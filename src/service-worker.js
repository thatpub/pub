var dataCacheName = 'thatPub';
var cacheName = 'thatPubCache';
var filesToCache = [
  '/',
  '/index.html',
  '/img/logo.png',
  '/img/logo.svg'
  // '/fonts/RobotoSlab-'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  var dataUrl = 'https://that.pub/find/';
  if (e.request.url.indexOf(dataUrl) === 0) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          return caches.open(dataCacheName).then(function(cache) {
            cache.put(e.request.url, response.clone());
            console.log('[ServiceWorker] Fetched&Cached Data');
            return response;
          });
        })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
