/*
 * Real-time Firestore integration for the Authority dashboard.
 * This script fetches Firestore `reports` documents and passes them
 * to the UI and map controllers for rendering.
 */
import { db } from '../config/firebase.js';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  limit,
  getDocs,
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
 * Fetches recent reports for the jurisdiction.
 */
function listenForRecentReports() {
    const reportsCol = collection(db, 'reports');
    const recentReportsQuery = query(
        reportsCol,
        orderBy('createdAt', 'desc'),
        limit(2)
    );

    onSnapshot(recentReportsQuery, (snapshot) => {
        const recentReports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const transformedReports = transformRecentReports(recentReports);
        renderDashboardContent({ reportsInJurisdiction: transformedReports });
    });
}

/**
 * Fetches pending verification reports.
 */
function listenForPendingVerifications() {
    const reportsCol = collection(db, 'reports');
    const pendingReportsQuery = query(
        reportsCol,
        where('status', '==', 'pending_verification'),
        orderBy('createdAt', 'desc')
    );

    onSnapshot(pendingReportsQuery, (snapshot) => {
        const pendingReports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const transformedReports = transformPendingVerifications(pendingReports);
        renderDashboardContent({ pendingVerifications: transformedReports });
    });
}

/**
 * Fetches resolved incidents.
 */
function listenForResolvedIncidents() {
    const reportsCol = collection(db, 'reports');
    const resolvedReportsQuery = query(
        reportsCol,
        where('status', '==', 'resolved')
    );

    onSnapshot(resolvedReportsQuery, (snapshot) => {
        const resolvedReports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const transformedReports = transformResolvedIncidents(resolvedReports);
        renderDashboardContent({ resolvedIncidents: transformedReports });
    });
}

/**
 * Fetches all reports for the table and map view.
 */
function listenForAllReports() {
    const reportsCol = collection(db, 'reports');
    const allReportsQuery = query(
        reportsCol,
        orderBy('createdAt', 'desc')
    );

    onSnapshot(allReportsQuery, (snapshot) => {
        allReports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const transformedReports = allReports.map(r => ({
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
        renderReportsTable(transformedReports);

        if (!document.getElementById('mapview-content').classList.contains('hidden')) {
            loadReportsOnMap(getReports());
        }
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

export async function getReportsInBounds(bounds) {
    // This is a simplified example. A real implementation would use geohashing.
    const center = bounds.getCenter();
    const lat = center.lat();
    const lng = center.lng();
    const radius = 10; // in km

    const lowerLat = lat - (radius / 111.045);
    const upperLat = lat + (radius / 111.045);
    const lowerLng = lng - (radius / (111.045 * Math.cos(lat * (Math.PI / 180))));
    const upperLng = lng + (radius / (111.045 * Math.cos(lat * (Math.PI / 180))));

    const reportsCol = collection(db, 'reports');
    const q = query(
        reportsCol,
        where('location.latitude', '>', lowerLat),
        where('location.latitude', '<', upperLat),
    );

    const snapshot = await getDocs(q);
    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Additional filtering for longitude since Firestore doesn't support multiple range queries
    return reports.filter(report => report.location.longitude > lowerLng && report.location.longitude < upperLng);
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    listenForRecentReports();
    listenForPendingVerifications();
    listenForResolvedIncidents();
    listenForAllReports();
});
