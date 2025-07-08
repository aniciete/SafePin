import { db } from '../config/firebase.js';
import { doc, getDoc } from 'firebase/firestore';

class VerificationController {
    constructor() {
        this.form = document.getElementById('verificationForm');
        this.reportIdInput = document.getElementById('reportId');
        this.statusDisplaySection = document.getElementById('status-display-section');
        this.statusDetails = document.getElementById('status-details');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.spinner = this.submitButton.querySelector('.loading-spinner');
        this.btnText = this.submitButton.querySelector('.btn-text');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(event) {
        event.preventDefault();
        const reportId = this.reportIdInput.value.trim();

        if (!reportId) {
            this.showError('Please enter a valid report ID.');
            return;
        }

        this.showLoadingState();

        try {
            const report = await this.fetchReport(reportId);
            if (report) {
                this.displayStatus(report);
            } else {
                this.showError('Report not found.');
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            this.showError('An error occurred while fetching the report.');
        } finally {
            this.hideLoadingState();
        }
    }

    async fetchReport(reportId) {
        const reportRef = doc(db, 'reports', reportId);
        const reportSnap = await getDoc(reportRef);

        if (reportSnap.exists()) {
            return reportSnap.data();
        } else {
            return null;
        }
    }

    displayStatus(report) {
        this.statusDetails.innerHTML = `
            <p><strong>Report ID:</strong> ${this.reportIdInput.value}</p>
            <p><strong>Status:</strong> ${report.status}</p>
            <p><strong>Incident Type:</strong> ${report.incidentType}</p>
            <p><strong>Description:</strong> ${report.description}</p>
        `;
        this.statusDisplaySection.classList.remove('hidden');
    }

    showError(message) {
        this.statusDetails.innerHTML = `<p class="error">${message}</p>`;
        this.statusDisplaySection.classList.remove('hidden');
    }

    showLoadingState() {
        this.btnText.textContent = 'Checking...';
        this.spinner.classList.remove('hidden');
        this.submitButton.disabled = true;
    }

    hideLoadingState() {
        this.btnText.textContent = 'Check Status';
        this.spinner.classList.add('hidden');
        this.submitButton.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VerificationController();
});
