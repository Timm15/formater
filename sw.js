/* Formater service worker: the page works offline once opened, libraries and models are kept after first use,
   and files shared to the installed app from the phone's "Share" menu arrive in the queue. */
const SHELL = 'formater-shell-1';
const LIBS = 'formater-libs';      // CDN files with a version in the address never change, so they are kept for good
const MODELS = 'formater-models-1'; // the neural networks and OCR languages from this site; the number changes when they do
const SHARE = 'formater-share';
const SHELL_FILES = ['./', './index.html', './meta.js', './manifest.webmanifest', './favicon.svg', './favicon.png', './apple-touch-icon.png', './icon-192.png'];
const CDN = /^https:\/\/(cdn\.jsdelivr\.net|unpkg\.com)\/.+@\d/;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('formater-') && ![SHELL, LIBS, MODELS, SHARE].includes(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Files from the "Share" menu: kept for a moment, then the page picks them up
async function shared(req) {
  try {
    const form = await req.formData(), c = await caches.open(SHARE), now = Date.now();
    await Promise.all(form.getAll('files').filter(f => f && f.size).map((f, i) =>
      c.put(new Request(`./__shared/${now}-${i}`), new Response(f, { headers: { 'content-type': f.type || 'application/octet-stream', 'x-name': encodeURIComponent(f.name || `file-${i + 1}`) } }))));
  } catch (e) { /* nothing usable was shared: the page just opens */ }
  return Response.redirect('./?shared=1', 303);
}
// The page itself: the newest from the network, the kept copy when offline
async function networkFirst(req) {
  const c = await caches.open(SHELL);
  try {
    const res = await fetch(req);
    if (res.ok) c.put(req, res.clone());
    return res;
  } catch (e) {
    return (await c.match(req, { ignoreSearch: true })) || (await c.match('./index.html')) || Response.error();
  }
}
async function cacheFirst(name, req) {
  const c = await caches.open(name), hit = await c.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok && res.type !== 'opaque') c.put(req, res.clone());
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method === 'POST' && url.origin === location.origin && url.pathname.endsWith('/share-target')) return e.respondWith(shared(req));
  if (req.method !== 'GET' || req.headers.has('range')) return;
  if (url.origin === location.origin) {
    if (/\/models\//.test(url.pathname)) return e.respondWith(cacheFirst(MODELS, req));
    if (req.mode === 'navigate' || /\.(html|js|webmanifest|svg|png)$/.test(url.pathname) || url.pathname.endsWith('/')) return e.respondWith(networkFirst(req));
    return;
  }
  if (CDN.test(req.url)) e.respondWith(cacheFirst(LIBS, req));
});
