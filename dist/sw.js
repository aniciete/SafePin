import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../src/config/firebase.js';

// Initialize Firebase in the service worker
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Cache name for offline assets
const CACHE_NAME = 'safepin-offline-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/report.html',
  '/styles.css',
  '/main.js',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Background sync event - process queued reports
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports());
  }
});

/**
 * Processes queued reports when back online
 */
async function syncReports() {
  const db = await openOfflineDB();
  const reports = await getAllReports(db);

  for (const report of reports) {
    try {
      // Attempt to submit the report
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report.data)
      });

      if (response.ok) {
        // Remove successfully submitted report from queue
        await removeReport(db, report.id);
      } else {
        // Increment retry count if submission failed
        await updateRetryCount(db, report.id);
      }
    } catch (error) {
      console.error('Failed to sync report:', error);
    }
  }
}

/**
 * Opens the offline database
 */
function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('safepin_offline', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Gets all queued reports from IndexedDB
 */
function getAllReports(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pending_reports', 'readonly');
    const store = transaction.objectStore('pending_reports');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Removes a report from the queue
 */
function removeReport(db, reportId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pending_reports', 'readwrite');
    const store = transaction.objectStore('pending_reports');
    const request = store.delete(reportId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Updates the retry count for a failed report
 */
function updateRetryCount(db, reportId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pending_reports', 'readwrite');
    const store = transaction.objectStore('pending_reports');
    const request = store.get(reportId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const report = request.result;
      report.retryCount = (report.retryCount || 0) + 1;
      
      const updateRequest = store.put(report);
      updateRequest.onerror = () => reject(updateRequest.error);
      updateRequest.onsuccess = () => resolve();
    };
  });
} 