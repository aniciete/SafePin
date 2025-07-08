/*
 * Real-time Firestore integration for the Authority dashboard.
 * This script fetches Firestore `reports` documents and passes them
 * to the UI and map controllers for rendering.
 */
import { db } from '../config/firebase.js';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { renderDashboardContent, renderReportsTable } from './ui.manager.js';
import { loadReportsOnMap } from './map.controller.js';

// --- Global State ---
let allReports = []; // Local cache of all loaded reports

/**
 * Formats a Firestore timestamp into a readable string.
 * @param {object} ts - The Firestore timestamp object.
 * @returns {string} - The formatted date string.
 */
const formatDate = (ts) =>
  ts && ts.seconds ? new Date(ts.seconds * 1000).toLocaleString() : 'N/A';

/**
 * Transforms raw report data from Firestore into a structure
 * usable by the UI components.
 * @param {Array} reports - The array of reports from Firestore.
 * @returns {object} - The transformed data object.
 */
function transformDataForUI(reports) {
  const reportsInJurisdiction = reports.slice(0, 2).map(r => ({
    id: r.id,
    street: r.locationName || 'Unknown Street',
    date: formatDate(r.createdAt),
    type: r.incidentType,
    category: r.incidentType,
    description: r.description,
    suspect: 'Unknown',
    status: r.status,
    verification: r.status,
  }));

  const pendingVerifications = reports.filter(r => r.status === 'pending_verification').map(r => ({
      id: r.id,
      location: r.locationName || 'Unknown Location',
      anonymousId: r.userId || 'Anonymous',
      date: formatDate(r.createdAt),
      type: r.incidentType,
      category: r.incidentType,
      description: r.description,
      status: r.status,
  }));

  const resolvedIncidents = reports.filter(r => r.status === 'resolved');
  const resolvedIncidentsBreakdown = resolvedIncidents.reduce((acc, report) => {
      const type = report.incidentType || 'Other';
      const existing = acc.find(item => item.type === type);
      if (existing) {
          existing.count++;
      } else {
          acc.push({ type, count: 1 });
      }
      return acc;
  }, []);


  return {
    jurisdiction: {
      district: '3 - Santa Cruz', // This should be dynamic in a real app
      barangay: '370',
    },
    reportsInJurisdiction,
    pendingVerifications,
    recentActivity: [], // Placeholder for now
    resolvedIncidents: {
      total: resolvedIncidents.length,
      breakdown: resolvedIncidentsBreakdown,
      crimeApprehensionRate: reports.length > 0 ? Math.round((resolvedIncidents.length / reports.length) * 100) : 0,
    },
    profile: {
        name: 'Isko H. Versosa', // This should be dynamic
        role: 'Barangay 370 Chairman (Level 2 SafePin Access)',
        code: '102-121-320'
    }
  };
}

/**
 * Fetches reports from Firestore and listens for real-time updates.
 */
function listenForReports() {
  const reportsCol = collection(db, 'reports');
  const reportsQuery = query(
    reportsCol,
    // where('status', 'in', ['verified', 'resolved', 'pending_verification']), // Example filter
    orderBy('createdAt', 'desc')
  );

  onSnapshot(reportsQuery, (snapshot) => {
    allReports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
    // Transform data and render UI
    const uiData = transformDataForUI(allReports);
    renderDashboardContent(uiData);
    renderReportsTable(allReports.map(r => ({
        id: r.id,
        street: r.locationName || 'Unknown',
        wanted: 'Unknown',
        progress: r.status,
        category: r.incidentType,
        description: r.description,
        verification: r.status,
        date: formatDate(r.createdAt),
        reporter: 'Anonymous',
        lat: r.location ? r.location.latitude : null,
        lng: r.location ? r.location.longitude : null,
    })));

    // Update map if it's visible
    if (!document.getElementById('mapview-content').classList.contains('hidden')) {
        loadReportsOnMap(getReports());
    }

  }, (error) => {
    console.error("Error fetching reports: ", error);
  });
}

/**
 * Returns the cached array of all reports.
 * @returns {Array}
 */
export function getReports() {
    return allReports.map(r => ({
        id: r.id,
        street: r.locationName || 'Unknown',
        wanted: 'Unknown',
        progress: r.status,
        category: r.incidentType,
        description: r.description,
        verification: r.status,
        date: formatDate(r.createdAt),
        reporter: 'Anonymous',
        lat: r.location ? r.location.latitude : null,
        lng: r.location ? r.location.longitude : null,
    }));
}


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
  listenForReports();
});
