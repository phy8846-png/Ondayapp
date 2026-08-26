// ---- Firebase Cloud Messaging (background push notifications) ----
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAOZWAgFeAxYprJ0pg5Fh5vQp1EoH8Xa6w",
  authDomain: "onday-ad9da.firebaseapp.com",
  projectId: "onday-ad9da",
  storageBucket: "onday-ad9da.firebasestorage.app",
  messagingSenderId: "712163393394",
  appId: "1:712163393394:web:4f6f697188add0e7e3a7eb",
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "onday";
  const body = (payload.notification && payload.notification.body) || "";
  self.registration.showNotification(title, {
    body,
    icon: "./icon-192.png",
    badge: "./icon-192.png",
  });
});

const CACHE_NAME = "onday-app-v1";
const CORE_ASSETS = ["./", "./index.html", "./bundle.js", "./styles.css", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for navigation/API-like requests, cache-first for static assets.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(request))
  );
});
