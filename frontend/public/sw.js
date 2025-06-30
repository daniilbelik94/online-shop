const CACHE_NAME = 'online-shop-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/placeholder-product.jpg'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Кэшируем только существующие файлы с обработкой ошибок
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(error => {
              console.warn(`Failed to cache ${url}:`, error);
              return null;
            })
          )
        );
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Пропускаем запросы к API и внешние ресурсы
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('http') && !event.request.url.includes(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).catch(error => {
          console.warn('Fetch failed:', error);
          // Возвращаем fallback для HTML страниц
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          return null;
        });
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Online Shop',
    icon: '/placeholder-product.jpg',
    badge: '/placeholder-product.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/placeholder-product.jpg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/placeholder-product.jpg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Online Shop', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 