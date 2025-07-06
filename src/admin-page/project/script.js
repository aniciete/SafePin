import {
    getAuth,
    signOut
} from "firebase/auth";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    addDoc,
    serverTimestamp,
    query,
    where,
    orderBy,
    limit,
    Timestamp
} from 'firebase/firestore';
import {
    getFunctions,
    httpsCallable
} from 'firebase/functions';
import {
    db,
    functions
} from '../../firebase-init.js';

// --- MODAL AND UI HELPER FUNCTIONS ---

let currentPromptCallback = null;
let currentConfirmCallback = null;
let currentDropdownPromptCallback = null;

function showMessageModal(message) {
    document.getElementById('messageText').textContent = message;
    document.getElementById('messageModal').style.display = 'flex';
}

function showDropdownPromptModal(message, options) {
    return new Promise((resolve) => {
        document.getElementById('dropdownPromptText').textContent = message;
        const selectElement = document.getElementById('dropdownPromptSelect');
        selectElement.innerHTML = '';
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
        document.getElementById('dropdownPromptModal').style.display = 'flex';
        currentDropdownPromptCallback = (value) => {
            document.getElementById('dropdownPromptModal').style.display = 'none';
            resolve(value);
        };
    });
}

function showConfirmModal(message) {
    return new Promise((resolve) => {
        document.getElementById('confirmText').textContent = message;
        document.getElementById('confirmModal').style.display = 'flex';
        currentConfirmCallback = (result) => {
            document.getElementById('confirmModal').style.display = 'none';
            resolve(result);
        };
    });
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// --- CORE LOGIC ---

let reportsData = []; // Global store for reports

/**
 * Logs an activity to the 'activity_log' collection in Firestore.
 * @param {string} description - The description of the activity.
 */
async function logActivity(description) {
    try {
        await addDoc(collection(db, 'activity_log'), {
            description: description,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}

/**
 * Listens for real-time updates on the reports collection.
 */
function listenForReports() {
    const reportsCollection = collection(db, 'reports');
    const tableBody = document.getElementById('reports-table-body');

    onSnapshot(reportsCollection, (snapshot) => {
        reportsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderReportsTable(reportsData);
        updateAnalyticsCharts(reportsData); // Update analytics with new data

    }, (error) => {
        console.error("Error fetching reports: ", error);
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-red-500">Error loading reports.</td></tr>';
    });
}

/**
 * Renders the reports into the main table.
 * @param {Array} reports - An array of report objects.
 */
function renderReportsTable(reports) {
    const tableBody = document.getElementById('reports-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    if (reports.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No reports found.</td></tr>';
        return;
    }

    reports.forEach(report => {
        const row = document.createElement('tr');
        row.className = 'border-b';
        row.dataset.reportId = report.id;

        const formatDate = (timestamp) => {
            if (!timestamp || !timestamp.seconds) return 'N/A';
            return new Date(timestamp.seconds * 1000).toLocaleDateString();
        };

        const statusClass = getStatusClass(report.status);

        row.innerHTML = `
            <td class="py-2 px-3"><span class="font-mono text-sm">${report.id.substring(0, 8)}...</span></td>
            <td class="py-2 px-3">${report.incidentType || 'N/A'}</td>
            <td class="py-2 px-3">${report.location ? `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}` : 'N/A'}</td>
            <td class="py-2 px-3"><span class="px-2 py-1 rounded-full text-xs ${statusClass}">${report.status || 'N/A'}</span></td>
            <td class="py-2 px-3">${formatDate(report.createdAt)}</td>
            <td class="py-2 px-3 text-center">
                <button class="view-report-btn p-1 text-blue-600 hover:text-blue-800" title="View"><i data-lucide="eye"></i></button>
                <button class="edit-report-btn p-1 text-green-600 hover:text-green-800" title="Edit Status"><i data-lucide="pencil"></i></button>
                <button class="delete-report-btn p-1 text-red-600 hover:text-red-800" title="Delete"><i data-lucide="trash-2"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    lucide.createIcons();
}

/**
 * Handles clicks on the report table body using event delegation.
 * @param {Event} event - The click event.
 */
async function handleTableClick(event) {
    const button = event.target.closest('button');
    if (!button) return;

    const row = button.closest('tr');
    const reportId = row.dataset.reportId;
    const report = reportsData.find(r => r.id === reportId);

    if (button.classList.contains('edit-report-btn')) {
        const newStatus = await showDropdownPromptModal('Update Status', ['pending', 'verified', 'on-watch', 'resolved', 'rejected']);
        if (newStatus && newStatus !== report.status) {
            try {
                const reportRef = doc(db, 'reports', reportId);
                await updateDoc(reportRef, { status: newStatus });
                showMessageModal('Report status updated successfully!');
                logActivity(`Report #${reportId.substring(0, 6)} status changed to ${newStatus}.`);
            } catch (error) {
                console.error('Error updating report status:', error);
                showMessageModal('Failed to update report status.');
            }
        }
    } else if (button.classList.contains('delete-report-btn')) {
        const confirmed = await showConfirmModal(`Are you sure you want to delete report #${reportId}? This action cannot be undone.`);
        if (confirmed) {
            try {
                await deleteDoc(doc(db, 'reports', reportId));
                if (report.imageUrl) {
                    const deleteImageFunction = httpsCallable(functions, 'deleteImage');
                    await deleteImageFunction({ url: report.imageUrl });
                }
                showMessageModal('Report deleted successfully!');
                logActivity(`Report #${reportId.substring(0, 6)} was deleted.`);
            } catch (error) {
                console.error('Error deleting report:', error);
                showMessageModal(`Failed to delete report. Error: ${error.message}`);
            }
        }
    } else if (button.classList.contains('view-report-btn')) {
        alert(`Viewing report: ${reportId}\nDescription: ${report.description}`);
    }
}

/**
 * Returns a Tailwind CSS class based on the report status.
 * @param {string} status - The status of the report.
 * @returns {string} - The corresponding CSS class.
 */
function getStatusClass(status) {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'verified': return 'bg-blue-100 text-blue-800';
        case 'on-watch': return 'bg-indigo-100 text-indigo-800';
        case 'resolved': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

/**
 * Fetches user statistics and listens for recent activity to populate the Overview tab.
 */
function updateDashboardData() {
    const usersRef = collection(db, 'users');
    const activityLogRef = collection(db, 'activity_log');

    // Fetch User Statistics
    getDocs(usersRef).then(snapshot => {
        const totalUsers = snapshot.size;
        document.getElementById('total-users').textContent = totalUsers;

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const oneWeekAgoTimestamp = Timestamp.fromDate(oneWeekAgo);

        const newUsersQuery = query(usersRef, where('createdAt', '>=', oneWeekAgoTimestamp));
        getDocs(newUsersQuery).then(newUsersSnapshot => {
            document.getElementById('new-users').textContent = newUsersSnapshot.size;
        }).catch(err => console.error("Error fetching new users:", err));

        const activeUsersQuery = query(usersRef, where('lastLogin', '>=', oneWeekAgoTimestamp));
        getDocs(activeUsersQuery).then(activeUsersSnapshot => {
            document.getElementById('active-users').textContent = activeUsersSnapshot.size;
        }).catch(err => console.error("Error fetching active users:", err));

    }).catch(error => {
        console.error("Error fetching user stats: ", error);
        document.getElementById('total-users').textContent = 'Error';
        document.getElementById('new-users').textContent = 'Error';
        document.getElementById('active-users').textContent = 'Error';
    });

    // Listen for Recent Activity
    const recentActivityQuery = query(activityLogRef, orderBy('timestamp', 'desc'), limit(5));
    onSnapshot(recentActivityQuery, (snapshot) => {
        const container = document.getElementById('recent-updates-container');
        container.innerHTML = '';
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-xs text-gray-500">No recent activity.</p>';
            return;
        }
        snapshot.forEach(doc => {
            const activity = doc.data();
            const activityElement = document.createElement('div');
            activityElement.className = 'text-xs font-normal text-[#374151] border-b border-black border-opacity-10 py-1';
            activityElement.textContent = activity.description;
            container.appendChild(activityElement);
        });
    }, (error) => {
        console.error("Error fetching recent activity: ", error);
        const container = document.getElementById('recent-updates-container');
        container.innerHTML = '<p class="text-xs text-red-500">Error loading activity.</p>';
    });
}
// --- ANALYTICS CHARTS ---

let barChart, pieChart, radarChart, areaChart;

/**
 * Initializes all Chart.js instances.
 */
function initializeCharts() {
    if (barChart) barChart.destroy();
    if (pieChart) pieChart.destroy();
    if (radarChart) radarChart.destroy();
    if (areaChart) areaChart.destroy();

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    barChart = new Chart(document.getElementById('barChart').getContext('2d'), {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Incidents by Type', data: [] }] },
        options: commonOptions
    });

    pieChart = new Chart(document.getElementById('pieChart').getContext('2d'), {
        type: 'pie',
        data: { labels: [], datasets: [{ label: 'Severity Levels', data: [] }] },
        options: commonOptions
    });

    radarChart = new Chart(document.getElementById('radarChart').getContext('2d'), {
        type: 'radar',
        data: { labels: ['Performance', 'Reliability', 'Usability', 'Security', 'Accessibility'], datasets: [{ label: 'System Score', data: [9, 7, 8, 8, 6] }] }, // Static for now
        options: commonOptions
    });

    areaChart = new Chart(document.getElementById('areaChart').getContext('2d'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Reports Over Time', data: [], fill: true, tension: 0.4 }] },
        options: commonOptions
    });
}

/**
 * Updates all analytics charts with the latest report data.
 * @param {Array} reports - An array of report objects.
 */
function updateAnalyticsCharts(reports) {
    if (!barChart) return; // Charts not initialized yet

    // Bar Chart: Incident Types
    const incidentCounts = reports.reduce((acc, report) => {
        const type = report.incidentType || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
    barChart.data.labels = Object.keys(incidentCounts);
    barChart.data.datasets[0].data = Object.values(incidentCounts);
    barChart.data.datasets[0].backgroundColor = 'rgba(29, 78, 216, 0.7)';
    barChart.update();

    // Pie Chart: Severity Levels
    const severityCounts = reports.reduce((acc, report) => {
        const severity = report.severityLevel || 'Unknown';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
    }, {});
    pieChart.data.labels = Object.keys(severityCounts);
    pieChart.data.datasets[0].data = Object.values(severityCounts);
    pieChart.data.datasets[0].backgroundColor = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
    pieChart.update();

    // Area Chart: Reports Over Time
    const reportsByDay = reports.reduce((acc, report) => {
        if (report.createdAt && report.createdAt.seconds) {
            const date = new Date(report.createdAt.seconds * 1000).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
    }, {});
    const sortedDates = Object.keys(reportsByDay).sort((a, b) => new Date(a) - new Date(b));
    areaChart.data.labels = sortedDates;
    areaChart.data.datasets[0].data = sortedDates.map(date => reportsByDay[date]);
    areaChart.data.datasets[0].borderColor = '#1d4ed8';
    areaChart.data.datasets[0].backgroundColor = 'rgba(29, 78, 216, 0.2)';
    areaChart.update();
}

// --- TAB NAVIGATION ---

function setActiveTab(tabName) {
    const buttons = {
        'Overview': document.getElementById('overview-btn'),
        'Reports': document.getElementById('reports-btn'),
        'Analytics': document.getElementById('analytics-btn'),
    };
    const contents = {
        'Overview': document.getElementById('overview-content'),
        'Reports': document.getElementById('reports-content'),
        'Analytics': document.getElementById('analytics-content'),
    };

    Object.values(buttons).forEach(btn => btn.classList.remove('bg-blue-700', 'text-white'));
    Object.values(contents).forEach(content => content.classList.add('hidden'));

    if (buttons[tabName] && contents[tabName]) {
        buttons[tabName].classList.add('bg-blue-700', 'text-white');
        contents[tabName].classList.remove('hidden');
        if (tabName === 'Analytics') {
            updateAnalyticsCharts(reportsData);
        }
    }
}

// --- EVENT LISTENERS & INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initializeCharts();
    listenForReports();
    updateDashboardData();

    // Tab navigation
    document.getElementById('overview-btn').addEventListener('click', () => setActiveTab('Overview'));
    document.getElementById('reports-btn').addEventListener('click', () => setActiveTab('Reports'));
    document.getElementById('analytics-btn').addEventListener('click', () => setActiveTab('Analytics'));

    // Modal buttons
    document.getElementById('dropdownPromptConfirmBtn').addEventListener('click', () => currentDropdownPromptCallback && currentDropdownPromptCallback(document.getElementById('dropdownPromptSelect').value));
    document.getElementById('dropdownPromptCancelBtn').addEventListener('click', () => currentDropdownPromptCallback && currentDropdownPromptCallback(null));
    document.getElementById('confirmYesBtn').addEventListener('click', () => currentConfirmCallback && currentConfirmCallback(true));
    document.getElementById('confirmNoBtn').addEventListener('click', () => currentConfirmCallback && currentConfirmCallback(false));
    document.getElementById('messageOkBtn').addEventListener('click', () => closeModal('messageModal'));

    // Report table interaction
    document.getElementById('reports-table-body').addEventListener('click', handleTableClick);

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        const confirmed = await showConfirmModal('Are you sure you want to log out?');
        if (confirmed) {
            const auth = getAuth();
            signOut(auth).then(() => {
                window.location.href = '/login-page/index.html'; // Adjust path as needed
            }).catch((error) => {
                console.error('Logout failed:', error);
                showMessageModal('Logout failed. Please try again.');
            });
        }
    });

    // Set initial tab
    setActiveTab('Overview');
});
