// Service worker: lets the installed app open and play with no internet.
//   app files      saved on install; fetched fresh when online, from the device when offline
//   voice clips    saved as they play, or all at once from the homepage's download panel
//   GSAP + fonts   saved the first time they load
importScripts('shared/offline.js');

const ROOT = new URL('./', self.location).href;
const KEEP = [OFFLINE.appCache, OFFLINE.audioCache, OFFLINE.libraryCache];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const app = await caches.open(OFFLINE.appCache);
    await app.addAll(OFFLINE.files.map((path) => new Request(new URL(path, ROOT), { cache: 'reload' })));
    const libraries = await caches.open(OFFLINE.libraryCache);
    await Promise.all(OFFLINE.libraries.map((url) => libraries.add(url).catch(() => {})));
    await self.skipWaiting();
  })());
});

// Remove caches from older versions (e.g. old voice clips after audioCache is bumped).
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n.startsWith('word-games-') && !KEEP.includes(n)).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    event.respondWith(fromLibraries(request));
  } else if (url.pathname.endsWith('.m4a')) {
    event.respondWith(fromAudio(request));
  } else {
    event.respondWith(fromApp(event, request));
  }
});

// App files: from the internet when it answers within a few seconds, so every file is the same
// version (a new game with an old shared file could break); otherwise the copy on the device.
async function fromApp(event, request) {
  const cache = await caches.open(OFFLINE.appCache);
  try {
    // 'no-cache' asks the server whether the browser's copy is still current (a quick "not
    // modified" when it is). Page loads can't take options, so those go by address.
    const fresh = request.mode === 'navigate' ? fetch(request.url, { cache: 'no-cache' }) : fetch(request, { cache: 'no-cache' });
    const response = await Promise.race([
      fresh,
      new Promise((_, reject) => setTimeout(() => reject(new Error('slow')), 4000)),
    ]);
    // A page that moved (Cloudflare sends .../index.html to .../) must reach the browser as a
    // redirect; handing over the followed response would fail.
    if (response.redirected && request.mode === 'navigate') return Response.redirect(response.url, 302);
    if (response.ok && !response.redirected) event.waitUntil(cache.put(request, response.clone()));
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    return fetch(request);
  }
}

// Voice clips: from the device if saved, otherwise download the whole clip and save it.
async function fromAudio(request) {
  const cache = await caches.open(OFFLINE.audioCache);
  let response = await cache.match(request.url);
  if (!response) {
    response = await fetch(request.url); // without the Range header, to get the whole file
    if (response.ok) await cache.put(request.url, response.clone());
  }
  return partial(request, response);
}

// Safari asks for audio in byte ranges ("bytes=0-1") and won't play a reply that ignores them.
async function partial(request, response) {
  const range = request.headers.get('range');
  if (!range || !response.ok) return response;
  const body = await response.arrayBuffer();
  const size = body.byteLength;
  const [, from, to] = /bytes=(\d*)-(\d*)/.exec(range) || [];
  let start = from ? Number(from) : 0;
  let end = to ? Math.min(Number(to), size - 1) : size - 1;
  if (!from && to) { start = size - Number(to); end = size - 1; } // "bytes=-500": the last 500
  return new Response(body.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'audio/mp4',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

// GSAP and Google Fonts never change at these addresses, so a saved copy is always good.
async function fromLibraries(request) {
  const cache = await caches.open(OFFLINE.libraryCache);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
  return response;
}
