// AturDuit Service Worker
// Cache-first strategy untuk semua asset lokal
// Network-first untuk CDN (Tailwind, Chart.js, dll)

const CACHE_NAME = 'aturduit-v1';
const CACHE_CDN_NAME = 'aturduit-cdn-v1';

// Asset lokal yang wajib di-cache saat install
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/qris.png',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png'
];

// CDN assets yang dicache saat pertama kali diakses
const CDN_HOSTS = [
  'cdn.tailwindcss.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// ─── INSTALL: cache semua local asset ─────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing AturDuit Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching local assets...');
      return cache.addAll(LOCAL_ASSETS);
    }).then(() => {
      console.log('[SW] Install complete!');
      return self.skipWaiting(); // langsung aktif tanpa nunggu tab lama ditutup
    })
  );
});

// ─── ACTIVATE: hapus cache lama ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== CACHE_CDN_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activated! Claiming all clients...');
      return self.clients.claim(); // kontrol semua tab tanpa reload
    })
  );
});

// ─── FETCH: strategi cache per jenis request ──────────────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET & chrome-extension requests
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // CDN requests → Network-first, fallback ke cache
  if (CDN_HOSTS.some((host) => url.hostname.includes(host))) {
    event.respondWith(networkFirstCDN(event.request));
    return;
  }

  // Local assets → Cache-first, fallback ke network
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirstLocal(event.request));
    return;
  }
});

// Cache-first: cek cache dulu, kalau ga ada baru fetch network
async function cacheFirstLocal(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Fallback ke index.html kalau request navigasi gagal (offline)
    if (request.mode === 'navigate') {
      const cached = await caches.match('./index.html');
      if (cached) return cached;
    }
    throw error;
  }
}

// Network-first: coba network dulu, kalau gagal (offline) pakai cache
async function networkFirstCDN(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_CDN_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request, { cacheName: CACHE_CDN_NAME });
    if (cached) {
      console.log('[SW] Offline - serving CDN from cache:', request.url);
      return cached;
    }
    throw error;
  }
}
