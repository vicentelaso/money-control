/* Money Control — service worker
   Guarda la app en el teléfono para que abra sin internet.
   Si editas index.html, sube el número de CACHE para que el celular tome la versión nueva. */

var CACHE = "money-control-v4";
var ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/favicon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(ARCHIVOS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (llaves) {
      return Promise.all(llaves.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;

  var url = new URL(e.request.url);

  // Las tipografías de Google: se usan si están en caché, si no se piden y se guardan.
  if (url.origin.indexOf("fonts.g") !== -1) {
    e.respondWith(
      caches.match(e.request).then(function (hit) {
        return hit || fetch(e.request).then(function (res) {
          var copia = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
          return res;
        }).catch(function () { return hit; });
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Archivos propios: primero la red (para tomar cambios), con el caché como respaldo.
  // Solo se guardan respuestas buenas: si el sitio responde con error (404, 500),
  // se sigue mostrando la última versión que funcionó.
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res.ok) {
        var copia = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
        return res;
      }
      return caches.match(e.request).then(function (hit) {
        if (hit) return hit;
        if (e.request.mode === "navigate") {
          return caches.match("./index.html").then(function (idx) { return idx || res; });
        }
        return res;
      });
    }).catch(function () {
      return caches.match(e.request).then(function (hit) {
        return hit || caches.match("./index.html");
      });
    })
  );
});
