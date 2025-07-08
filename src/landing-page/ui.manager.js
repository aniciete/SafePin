/**
 * @fileoverview UI Manager for SafePin report page.
 * Handles all UI interactions like modals, buttons, and spinners.
 * @module ui.manager
 */

export class UIManager {
    constructor() {
        // Modals
        this.confirmModal = document.getElementById('confirmModal');
        this.successModal = document.getElementById('successModal');
        this.errorModal = document.getElementById('errorModal');

        // Buttons
        this.openConfirmBtn = document.getElementById('openConfirmModalBtn');
        this.cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
        this.confirmSubmitBtn = document.getElementById('triggerSuccessModalBtn');
        this.closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
        this.closeErrorModalBtn = document.getElementById('closeErrorModalBtn');

        // Spinners
        this.submitSpinner = this.openConfirmBtn.querySelector('.loading-spinner');
        this.confirmSpinner = this.confirmSubmitBtn.querySelector('.loading-spinner');
        
        // Text
        this.submitBtnText = this.openConfirmBtn.querySelector('.btn-text');
        this.confirmBtnText = this.confirmSubmitBtn.querySelector('.btn-text');
    }

    /**
     * Add event listeners for all UI elements.
     * @param {function} onConfirmSubmit - Callback for when the final submit is clicked.
     * @param {function} onOpenConfirm - Callback for when the initial submit is clicked.
     */
    addEventListeners(onConfirmSubmit, onOpenConfirm) {
        this.openConfirmBtn.addEventListener('click', onOpenConfirm);
        this.confirmSubmitBtn.addEventListener('click', onConfirmSubmit);

        this.cancelConfirmBtn.addEventListener('click', () => this.hideConfirmModal());
        this.closeSuccessModalBtn.addEventListener('click', () => this.hideSuccessModal());
        this.closeErrorModalBtn.addEventListener('click', () => this.hideErrorModal());
    }

    showConfirmModal() {
        this.confirmModal.classList.add('visible');
    }

    hideConfirmModal() {
        this.confirmModal.classList.remove('visible');
    }

    showSuccessModal(reportId) {
        document.getElementById('report-id').textContent = `#${reportId.substring(0, 8)}`;
        this.successModal.classList.add('visible');
    }

    hideSuccessModal() {
        this.successModal.classList.remove('visible');
    }

    showErrorModal(message) {
        document.getElementById('error-message').textContent = message;
        this.errorModal.classList.add('visible');
    }

    hideErrorModal() {
        this.errorModal.classList.remove('visible');
    }

    /**
     * Updates the summary panel in the confirmation modal.
     * @param {object} reportData - The data for the report.
     * @param {object} location - The location data.
     */
    updateSummary(reportData, location) {
        document.getElementById('summary-incident-type').textContent = reportData.incidentType;
        document.getElementById('summary-severity').textContent = reportData.severityLevel;
        document.getElementById('summary-location').textContent = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
        document.getElementById('summary-description').textContent = reportData.description.substring(0, 100) + (reportData.description.length > 100 ? '...' : '');
    }

    /**
     * Shows the loading state for the final submission button.
     */
    showLoadingState() {
        this.confirmBtnText.textContent = 'Submitting...';
        this.confirmSpinner.classList.remove('hidden');
        this.confirmSubmitBtn.disabled = true;
    }

    /**
     * Hides the loading state for the final submission button.
     */
    hideLoadingState() {
        this.confirmBtnText.textContent = 'Confirm';
        this.confirmSpinner.classList.add('hidden');
        this.confirmSubmitBtn.disabled = false;
    }
}