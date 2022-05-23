self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                'index.html', 
                'js/main.js',
                'icons/gridIcon.png',
                'css/style.css',
                'https://localhost/favicon.ico',
                'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap'
            ])
        })
    )
    self.skipWaiting();
    console.log('Service worker installed');
});

self.addEventListener('activate', (event) => {
    self.skipWaiting();
    console.log('Service worker activated');
});

self.addEventListener('fetch', (event) => {
    // console.log(event.request.url);
    if (navigator.onLine) {
        console.log('Du är online');
    } else {
        console.log('Du är offline');
        // console.log('Begärd URL: ', event.request)
        event.respondWith(
            caches.match(event.request).then((response) => {
                // console.log('response', response)
                if (response) return response;
                else return caches.match(new Request('index.html'))
            })  
        );
    }
});