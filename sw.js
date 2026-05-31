const CACHE_NAME = 'super-trunfo-v1';
const ASSETS = [
    './index.html',
    './manifest.json',
    './dema-inteiro-branco-horizontal.svg',
    './icon-rocket.svg',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=Cinzel:wght@600;800&family=Montserrat:wght@400;600;700&display=swap'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    // Para requisições do Google Apps Script (multiplayer), não cachear
    if (e.request.url.includes('script.google.com')) {
        return;
    }

    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Busca em segundo plano para atualizar o cache (Stale-While-Revalidate)
                fetch(e.request).then((networkResponse) => {
                    if (networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
                    }
                }).catch(() => {/* silencia erros de rede em background */});
                return cachedResponse;
            }

            return fetch(e.request).then((networkResponse) => {
                // Salva no cache recursos externos estáticos (ex: cartas.csv, sons)
                if (networkResponse.status === 200 && (
                    e.request.url.includes('githubusercontent') || 
                    e.request.url.includes('googleapis') || 
                    e.request.url.includes('gstatic')
                )) {
                    const clonedResponse = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clonedResponse));
                }
                return networkResponse;
            });
        })
    );
});
