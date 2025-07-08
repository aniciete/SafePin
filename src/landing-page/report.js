/**
 * @fileoverview Report page logic for SafePin. This file acts as the main orchestrator.
 * @module report
 */

import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import { submitReport } from '../services/report.service.js';
import { MapController } from './map.controller.js';
import { FormController } from './form.controller.js';
import { UIManager } from './ui.manager.js';

/**
 * Main orchestrator for the report submission page.
 * Initializes and coordinates all the controllers.
 */
class ReportOrchestrator {
    constructor() {
        this.formController = new FormController();
        this.uiManager = new UIManager();
        try {
            this.mapController = new MapController();
            this.setupEventListeners();
        } catch (error) {
            console.error("Failed to initialize ReportOrchestrator:", error);
            this.uiManager.showErrorModal(error.message || 'An unexpected error occurred during initialization.');
        }
    }

    /**
     * Sets up the main event listeners to coordinate between modules.
     */
    setupEventListeners() {
        this.uiManager.addEventListeners(
            this.handleSubmit.bind(this),
            this.handleOpenConfirm.bind(this)
        );

        // Cleanup on page unload
        window.addEventListener('pagehide', () => {
            if (this.mapController) {
                this.mapController.cleanup();
            }
        });
    }

    /**
     * Handles the initial click to open the confirmation modal.
     */
    handleOpenConfirm() {
        const isValid = this.formController.validateForm();
        if (isValid) {
            const reportData = this.formController.getFormData();
            const location = this.mapController.getLocation();
            this.uiManager.updateSummary(reportData, location);
            this.uiManager.showConfirmModal();
        }
    }

    /**
     * Handles the final submission process.
     */
    async handleSubmit() {
        this.uiManager.showLoadingState();

        try {
            this.uiManager.showLoadingState();
            const userId = await this.getAnonymousUserId();
            const location = this.mapController.getLocation();
            const { imageFile, ...formData } = this.formController.getFormData();

            const reportData = {
                ...formData,
                userId,
                location: {
                    latitude: location.lat,
                    longitude: location.lng,
                },
                status: 'pending_verification',
            };

            const reportId = await submitReport(reportData, imageFile);
            console.log('Report submitted with ID: ', reportId);

            this.uiManager.hideConfirmModal();
            this.uiManager.showSuccessModal(reportId);
            this.formController.resetForm();

        } catch (error) {
            console.error('Submission failed:', error);
            this.uiManager.hideConfirmModal();
            this.uiManager.showErrorModal(error.message || 'Failed to submit report. Please try again later.');
        } finally {
            this.uiManager.hideLoadingState();
        }
    }

    /**
     * Gets the current user's UID, signing them in anonymously if needed.
     * @returns {Promise<string>} The user's UID.
     */
    getAnonymousUserId() {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                if (user) {
                    resolve(user.uid);
                } else {
                    signInAnonymously(auth)
                        .then((userCredential) => resolve(userCredential.user.uid))
                        .catch((error) => {
                            console.error("Anonymous sign-in failed:", error);
                            reject(new Error('Could not establish a secure session.'));
                        });
                }
            });
        });
    }

}

// Initialize the orchestrator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ReportOrchestrator();
});
