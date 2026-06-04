/* Kill-switch service worker.
 * The PWA/offline worker was removed. This self-destroying worker replaces any
 * previously-installed one: it clears all caches, unregisters itself, and reloads
 * controlled tabs so the live site is served directly (no stale cache, no offline page).
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((c) => c.navigate(c.url));
    } catch {
      /* no-op */
    }
  })());
});
