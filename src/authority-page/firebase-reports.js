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
  onSnapshot,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

// --- Global State ---
let lastVisible = null; // For pagination
let allReports = []; // Local cache of all loaded reports
let currentReportDetails = {}; // For the modal

// --- UI Helper Functions ---
const formatDate = (ts) =>
  ts && ts.seconds ? new Date(ts.seconds * 1000).toLocaleString() : 'N/A';

const statusConfig = {
  verified: { text: 'Verified', color: 'blue-500', pulse: true },
  resolved: { text: 'Resolved', color: 'green-500', pulse: false },
  rejected: { text: 'Rejected', color: 'red-500', pulse: false },
  pending_verification: { text: 'Pending', color: 'yellow-500', pulse: true },
};

function buildDashboardData(reports) {
  // --- Summary Cards ---
  const totalReports = reports.length;
  const highSeverity = reports.filter((r) => r.severityLevel === 'High').length;
  const newToday = reports.filter((r) => {
    const today = new Date();
    const reportDate = new Date(r.createdAt.seconds * 1000);
    return today.toDateString() === reportDate.toDateString();
  }).length;

  document.getElementById('total-reports-value').textContent = totalReports;
  document.getElementById('high-severity-value').textContent = highSeverity;
  document.getElementById('new-today-value').textContent = newToday;

  // --- Reports Table ---
  const tableBody = document.getElementById('reports-table-body');
  tableBody.innerHTML = ''; // Clear existing rows
  reports.forEach((report) => {
    const status = statusConfig[report.status] || { text: 'Unknown', color: 'gray-500' };
    const row = `
      <tr class="hover:bg-gray-50">
        <td class="py-4 px-6 text-sm font-medium text-gray-900">${report.incidentType}</td>
        <td class="py-4 px-6 text-sm text-gray-500">${report.severityLevel}</td>
        <td class="py-4 px-6 text-sm text-gray-500">${report.description.substring(0, 50)}...</td>
        <td class="py-4 px-6 text-sm text-gray-500">${formatDate(report.createdAt)}</td>
        <td class="py-4 px-6 text-sm">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${status.color.split('-')[0]}-100 text-${status.color}">
            ${status.pulse ? `<span class="mr-1.5 h-2 w-2 bg-${status.color} rounded-full animate-pulse-custom"></span>` : ''}
            ${status.text}
          </span>
        </td>
        <td class="py-4 px-6 text-sm font-medium text-right">
          <button onclick="showReportDetails('${report.id}')" class="text-indigo-600 hover:text-indigo-900">View</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });

  // --- Map Markers ---
  updateMapMarkers(reports);
}

function updateMapMarkers(reports) {
  if (window.map && window.map.markers) {
    window.map.markers.forEach((marker) => marker.setMap(null));
    window.map.markers = [];
  } else if (window.map) {
    window.map.markers = [];
  }

  reports.forEach((report) => {
    if (window.google && window.map && report.location) {
      const marker = new google.maps.Marker({
        position: report.location,
        map: window.map,
        title: report.incidentType,
      });
      window.map.markers.push(marker);
    }
  });
}

window.showReportDetails = function (reportId) {
  const report = allReports.find((r) => r.id === reportId);
  if (!report) return;

  currentReportDetails = report;

  document.getElementById('modal-title').textContent = report.incidentType;
  document.getElementById('modal-status').textContent = report.status;
  document.getElementById('modal-severity').textContent = report.severityLevel;
  document.getElementById('modal-timestamp').textContent = formatDate(report.createdAt);
  document.getElementById('modal-description').textContent = report.description;
  document.getElementById('modal-image').src = report.imageUrl;
  document.getElementById('modal-location').textContent = `Lat: ${report.location.lat}, Lng: ${report.location.lng}`;

  document.getElementById('report-details-modal').classList.remove('hidden');
}

window.hideReportDetails = function () {
  document.getElementById('report-details-modal').classList.add('hidden');
}

function listenForReports() {
  const reportsCol = collection(db, 'reports');
  const reportsQuery = query(
    reportsCol,
    where('status', 'in', ['verified', 'resolved']),
    orderBy('createdAt', 'desc')
  );

  onSnapshot(reportsQuery, (snapshot) => {
    allReports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    buildDashboardData(allReports);
  }, (error) => {
    console.error("Error fetching reports: ", error);
  });
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
  // Make sure lucide icons are loaded
  if (window.lucide) {
    lucide.createIcons();
  }

  listenForReports();
});
