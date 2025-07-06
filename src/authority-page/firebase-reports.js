/*
 * Real-time Firestore integration for the Authority dashboard.
 * This script converts Firestore `reports` documents to the structures
 * expected by the existing UI helpers defined inside index.html.
 */
import { db } from '../modules/firebase-init.js';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

// Utilities
const formatDate = (ts) =>
  ts && ts.seconds ? new Date(ts.seconds * 1000).toLocaleString() : 'N/A';

let lastVisible = null;
let allReports = [];

async function fetchReports(loadMore = false) {
  const reportsCol = collection(db, 'reports');
  let reportsQuery;

  if (loadMore && lastVisible) {
    reportsQuery = query(
      reportsCol,
      where('status', 'in', ['verified', 'resolved']),
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible),
      limit(25)
    );
  } else {
    allReports = []; // Reset on initial load
    reportsQuery = query(
      reportsCol,
      where('status', 'in', ['verified', 'resolved']),
      orderBy('createdAt', 'desc'),
      limit(25)
    );
  }

  const snapshot = await getDocs(reportsQuery);
  const newReports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
  allReports = [...allReports, ...newReports];
  lastVisible = snapshot.docs[snapshot.docs.length - 1];

  buildDashboardData(allReports);

  // Show/hide 'Load More' button
  const loadMoreBtn = document.getElementById('loadMoreReports');
  if (snapshot.empty || snapshot.docs.length < 25) {
    if(loadMoreBtn) loadMoreBtn.style.display = 'none';
  } else {
    if(loadMoreBtn) loadMoreBtn.style.display = 'block';
  }
}

// Initial load
fetchReports();

// Add a 'Load More' button to your index.html and wire it up
// e.g., <button id="loadMoreReports">Load More</button>
document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.getElementById('loadMoreReports');
    if(loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => fetchReports(true));
    }
});

function buildDashboardData(reports) {
  // Table & map data (flat list)
  window.reportsData = reports.map((r) => ({
    id: `#${r.id.substring(0, 8)}`,
    street:
      r.location && r.location.lat
        ? `${r.location.lat.toFixed(4)}, ${r.location.lng.toFixed(4)}`
        : 'Unknown',
    wanted: r.suspect || 'Unknown',
    progress: r.status || 'pending_verification',
    type: r.incidentType,
    category: r.incidentType,
    description: r.description,
    verification: r.status || 'Pending',
    date: formatDate(r.createdAt),
    reporter: r.reporter || 'Anonymous',
    lat: r.location?.lat,
    lng: r.location?.lng,
  }));

  // Simple breakdowns for overview widgets
  const pending = window.reportsData.filter(
    (r) => r.progress === 'pending_verification'
  );
  const resolved = window.reportsData.filter((r) => r.progress === 'resolved');

  window.mockData = {
    jurisdiction: {
      district: 'YOUR DISTRICT',
      barangay: 'YOUR BARANGAY',
    },
    reportsInJurisdiction: window.reportsData.slice(0, 5),
    pendingVerifications: pending.slice(0, 5).map((r) => ({
      id: r.id,
      location: r.street,
      anonymousId: r.reporter,
      date: r.date,
      type: r.type,
      category: r.category,
      description: r.description,
      status: r.verification,
    })),
    resolvedIncidents: {
      total: resolved.length,
      breakdown: [],
      crimeApprehensionRate: 0,
    },
    recentActivity: [],
  };

  // Re-render dashboards if helpers exist
  // Debounce rendering to avoid excessive updates if called frequently
  clearTimeout(window.renderTimeout);
  window.renderTimeout = setTimeout(() => {
      if (typeof window.renderDashboardContent === 'function') {
        window.renderDashboardContent();
      }
      if (typeof window.loadReportsOnMap === 'function') {
        window.loadReportsOnMap();
      }
  }, 200);
}
