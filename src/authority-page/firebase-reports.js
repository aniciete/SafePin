/*
 * Real-time Firestore integration for the Authority dashboard.
 * This script converts Firestore `reports` documents to the structures
 * expected by the existing UI helpers defined inside index.html.
 */
import { db } from "../../firebase-init.js";
import {
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Utilities
const formatDate = (ts) =>
  ts && ts.seconds ? new Date(ts.seconds * 1000).toLocaleString() : "N/A";

const reportsCol = collection(db, "reports");

onSnapshot(reportsCol, (snapshot) => {
  const reports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  buildDashboardData(reports);
});

function buildDashboardData(reports) {
  // Table & map data (flat list)
  window.reportsData = reports.map((r) => ({
    id: `#${r.id.substring(0, 8)}`,
    street:
      r.location && r.location.lat
        ? `${r.location.lat.toFixed(4)}, ${r.location.lng.toFixed(4)}`
        : "Unknown",
    wanted: r.suspect || "Unknown",
    progress: r.status || "pending_verification",
    type: r.incidentType,
    category: r.incidentType,
    description: r.description,
    verification: r.status || "Pending",
    date: formatDate(r.createdAt),
    reporter: r.reporter || "Anonymous",
    lat: r.location?.lat,
    lng: r.location?.lng,
  }));

  // Simple breakdowns for overview widgets
  const pending = window.reportsData.filter(
    (r) => r.progress === "pending_verification"
  );
  const resolved = window.reportsData.filter((r) => r.progress === "resolved");

  window.mockData = {
    jurisdiction: {
      district: "YOUR DISTRICT",
      barangay: "YOUR BARANGAY",
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
  if (typeof window.renderDashboardContent === "function") {
    window.renderDashboardContent();
  }
  if (typeof window.loadReportsOnMap === "function") {
    window.loadReportsOnMap();
  }
}
