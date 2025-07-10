/**
 * UI-related utility functions
 * @module ui
 */

/**
 * Show authentication feedback
 * @param {string} message - Feedback message
 * @param {string} type - Feedback type (success, error, warning)
 */
export function showAuthFeedback(message, type = 'info') {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `auth-feedback ${type}`;
    feedbackDiv.textContent = message;

    // Remove any existing feedback
    const existingFeedback = document.querySelector('.auth-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    document.body.appendChild(feedbackDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        feedbackDiv.remove();
    }, 5000);
}

/**
 * Show session timeout warning
 */
export function showSessionWarning() {
    const warningModal = document.createElement('div');
    warningModal.className = 'session-warning-modal';
    warningModal.innerHTML = `
        <div class="modal-content">
            <h3>Session Expiring Soon</h3>
            <p>Your session will expire in 5 minutes due to inactivity.</p>
            <button id="extend-session-btn" class="btn btn-primary">Stay Logged In</button>
        </div>
    `;
    document.body.appendChild(warningModal);

    const extendBtn = document.getElementById('extend-session-btn');
    extendBtn.addEventListener('click', () => {
        warningModal.remove();
        // The session manager will be responsible for resetting the timer
    });
}

/**
 * Triggers the download of a text file with the report details.
 * @param {object} reportData - The data for the report.
 * @private
 */
export function downloadReportAsTxt(reportData) {
    const content = [
        'Incident Report',
        '---------------------------',
        `Date: ${new Date().toLocaleString()}`,
        `Report ID: ${reportData.id || 'N/A'}`,
        `User ID: ${reportData.userId}`,
        `Incident Type: ${reportData.incidentType}`,
        `Severity: ${reportData.severityLevel}`,
        `Location (Lat, Lng): ${reportData.location.latitude}, ${reportData.location.longitude}`,
        `Description: ${reportData.description}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safepin_report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}