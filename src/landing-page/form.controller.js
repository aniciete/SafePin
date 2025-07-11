/**
 * @fileoverview Form controller for report submission
 * Handles form validation, image optimization, and submission
 */

import { submitReport } from '../services/report.service.js';

/**
 * Form Controller class
 */
export class FormController {
    constructor() {
        this.form = document.getElementById('report-form');
        this.imageInput = document.getElementById('image-upload');
        this.imagePreview = document.getElementById('image-preview');
        this.submitButton = document.getElementById('submit-report');
        this.setupEventListeners();
    }

    /**
     * Set up event listeners
     * @private
     */
    setupEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.imageInput.addEventListener('change', this.handleImageUpload.bind(this));
    }

    /**
     * Handle form submission
     * @param {Event} event
     * @private
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        // Reset previous errors
        this.clearErrors();

        try {
            // Validate form
            const errors = this.validateForm();
            if (Object.keys(errors).length > 0) {
                this.displayErrors(errors);
                return;
            }

            // Disable submit button
            this.submitButton.disabled = true;
            this.submitButton.textContent = 'Submitting...';

            // Get form data
            const formData = new FormData(this.form);
            const reportData = {
                incidentType: formData.get('incidentType'),
                severity: formData.get('severity'),
                description: formData.get('description'),
                location: JSON.parse(formData.get('location')),
                timestamp: new Date().toISOString(),
                userId: `anon_${Date.now()}`
            };

            console.log('Submitting report:', reportData);

            // Submit report
            const imageFile = this.imageInput.files[0];
            const result = await submitReport(reportData, imageFile);

            // Show success message
            if (result.status === 'online') {
                this.showSuccessMessage('Report submitted successfully!');
            } else {
                this.showSuccessMessage('You are offline. Your report has been saved and will be submitted when you reconnect.');
            }
            this.showSuccessMessage();
            this.form.reset();

        } catch (error) {
            console.error('Error submitting report:', error);
            this.showErrorMessage('Failed to submit report. Please try again.');
        } finally {
            // Re-enable submit button
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Submit Report';
        }
    }

    /**
     * Validate form data
     * @private
     * @returns {Object} Validation errors
     */
    validateForm() {
        const errors = {};
        const formData = new FormData(this.form);

        // Check incident type
        if (!formData.get('incidentType')) {
            errors.incidentType = 'Please select an incident type';
        }

        // Check severity
        if (!formData.get('severity')) {
            errors.severity = 'Please select severity level';
        }

        // Check location
        const location = formData.get('location');
        if (!location) {
            errors.location = 'Please select a location on the map';
        }

        // Check description length
        const description = formData.get('description');
        if (description && description.length > 500) {
            errors.description = 'Description must be less than 500 characters';
        }

        // Check image size
        const image = this.imageInput.files[0];
        if (image && image.size > 5 * 1024 * 1024) {
            errors.image = 'Image size must be less than 5MB';
        }

        return errors;
    }

    /**
     * Display form errors
     * @param {Object} errors
     * @private
     */
    displayErrors(errors) {
        Object.entries(errors).forEach(([field, message]) => {
            const element = document.getElementById(`${field}-error`);
            if (element) {
                element.textContent = message;
                element.style.display = 'block';
                
                // Add error class to form group
                const formGroup = document.querySelector(`[data-field="${field}"]`);
                if (formGroup) {
                    formGroup.classList.add('has-error');
                }
            }
        });
    }

    /**
     * Clear form errors
     * @private
     */
    clearErrors() {
        // Clear error messages
        const errorElements = document.querySelectorAll('[id$="-error"]');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });

        // Remove error classes
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('has-error');
        });
    }

    /**
     * Show success message
     * @private
     */
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'alert alert-success';
        message.textContent = 'Report submitted successfully!';
        this.form.insertBefore(message, this.form.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    /**
     * Show error message
     * @param {string} text
     * @private
     */
    showErrorMessage(text) {
        const message = document.createElement('div');
        message.className = 'alert alert-error';
        message.textContent = text;
        this.form.insertBefore(message, this.form.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    /**
     * Handle image upload
     * @param {Event} event
     * @private
     */
    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('Please upload an image file');
            }

            // Validate file size
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('Image size must be less than 5MB');
            }

            // Show image preview
            await this.showImagePreview(file);

        } catch (error) {
            console.error('Error handling image upload:', error);
            this.showErrorMessage(error.message);
            this.imageInput.value = ''; // Clear the input
        }
    }

    /**
     * Show image preview
     * @param {File} file
     * @private
     */
    async showImagePreview(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (this.imagePreview) {
                    this.imagePreview.src = e.target.result;
                    this.imagePreview.alt = `Preview of ${file.name}`;
                    this.imagePreview.classList.remove('hidden');
                }
                resolve();
            };
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Submit report to backend
     * @param {Object} reportData
     * @private
     */
}