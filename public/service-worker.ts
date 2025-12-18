/// <reference lib="webworker" />

const CACHE_NAME = 'copart-v1';
const DYNAMIC_CACHE = 'copart-dynamic-v1';
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.ico',
];

// Type declarations
interface InstallEvent extends ExtendableEvent {
  waitUntil(promise: Promise<void>): void;
}

interface ActivateEvent extends ExtendableEvent {
  waitUntil(promise: Promise<any>): void;
}

interface FetchEventType extends ExtendableEvent {
  request: Request;
  respondWith(promise: Promise<Response>): void;
}

interface MessageEventType extends ExtendableEvent {
  data: { type: string; [key: string]: any };
}

// Install event - cache static assets
(self as any).addEventListener('install', (event: any) => {
  const installEvent = event as InstallEvent;
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        return Promise.resolve();
      });
    })
  );
  (self as any).skipWaiting();
});

// Activate event - clean up old caches
(self as any).addEventListener('activate', (event: any) => {
  const activateEvent = event as ActivateEvent;
  activateEvent.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  (self as any).clients.claim();
});

// Fetch event - implement cache strategy
(self as any).addEventListener('fetch', (event: any) => {
  const fetchEvent = event as FetchEventType;
  const { request } = fetchEvent;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests: network first, fallback to cache
  if (request.url.includes('/api/')) {
    fetchEvent.respondWith(networkFirst(request));
    return;
  }

  // HTML pages: cache first, fallback to network
  if (request.headers.get('accept')?.includes('text/html')) {
    fetchEvent.respondWith(cacheFirst(request));
    return;
  }

  // Images: cache first, fallback to network
  if (request.destination === 'image') {
    fetchEvent.respondWith(cacheFirstWithFallback(request));
    return;
  }

  // CSS/JS: cache first, fallback to network
  if (request.destination === 'style' || request.destination === 'script') {
    fetchEvent.respondWith(cacheFirst(request));
    return;
  }

  // Default: network first
  fetchEvent.respondWith(networkFirst(request));
});

// Network first strategy: try network, fallback to cache
async function networkFirst(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Network failed, try cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // Return offline page
    const offline = await caches.match('/offline.html');
    return offline || new Response('Offline', { status: 503 });
  }
}

// Cache first strategy: try cache, fallback to network
async function cacheFirst(request: Request): Promise<Response> {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const offline = await caches.match('/offline.html');
    return offline || new Response('Offline', { status: 503 });
  }
}

// Cache first with fallback to network placeholder
async function cacheFirstWithFallback(
  request: Request
): Promise<Response> {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Return placeholder image
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#e5e7eb" width="400" height="300"/><text x="50%" y="50%" font-size="16" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">Offline</text></svg>',
      {
        headers: { 'Content-Type': 'image/svg+xml' },
        status: 503,
      }
    );
  }
}

// Handle messages from client
(self as any).addEventListener('message', (event: any) => {
  const messageEvent = event as MessageEventType;
  if (messageEvent.data && messageEvent.data.type === 'SKIP_WAITING') {
    (self as any).skipWaiting();
  }
});

export {};
