var cache_version = 2;
var chache_name = 'yu';
var current_caches = {
    prefetch: 'prefetch-cache-v' + cache_version
};
var filesToCache = [
    '/',
    '/archives/index.html',
    '/css/apollo.css',
    '/favicon.png',
    '/img/icon/favicon-128.png'
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(chache_name).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            console.log(cache);
            return cache.addAll(filesToCache);
        })
    );
});