import { uploadImage, submitReport } from '../services/supabaseService.js';

/**
 * Form Controller class
 */
export class FormController {
    constructor(incidentMap) {
        this.form = document.getElementById('report-form');
        this.imageInput = document.getElementById('image-upload');
        this.imagePreview = document.getElementById('image-preview');
        this.submitButton = document.getElementById('submit-report');
        this.loadingSpinner = this.submitButton.querySelector('.loading-spinner');
        this.messageContainer = document.getElementById('form-messages');
        this.charCount = document.querySelector('.character-count');
        this.incidentMap = incidentMap; // Store map instance
        this.setupEventListeners();
    }

    /**
     * Set up event listeners
     * @private
     */
    setupEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.imageInput.addEventListener('change', this.handleImageUpload.bind(this));
        const description = document.getElementById('description');
        if(description) {
            description.addEventListener('input', this.updateCharCount.bind(this));
        }
    }

    updateCharCount(event) {
        const count = event.target.value.length;
        this.charCount.textContent = `${count}/500`;
    }

    /**
     * Handle form submission
     * @param {Event} event
     * @private
     */
    async handleSubmit(event) {
        event.preventDefault();
        this.clearErrors();
        this.setLoading(true);

        try {
            const errors = this.validateForm();
            if (Object.keys(errors).length > 0) {
                this.displayErrors(errors);
                this.showMessage('Please correct the errors before submitting.', 'error');
                this.setLoading(false); // Stop loading on validation error
                return;
            }

            const formData = new FormData(this.form);
            const imageFile = this.imageInput.files[0];

            // 1. Upload image to Supabase Storage
            const imageUrl = await uploadImage(imageFile);

            // 2. Insert report data into Supabase database
            const reportData = {
                latitude: parseFloat(formData.get('latitude')),
                longitude: parseFloat(formData.get('longitude')),
                incident_type: formData.get('incidentType'),
                severity: formData.get('severity'),
                description: formData.get('description'),
                image_url: imageUrl,
                timestamp: new Date().toISOString(),
            };

            await submitReport(reportData);

            this.showMessage('Report submitted successfully!', 'success');
            this.resetForm();

        } catch (error) {
            console.error('Error submitting report:', error);
            this.showMessage(error.message, 'error');
        } finally {
            this.setLoading(false);
        }
    }

    resetForm() {
        this.form.reset();
        this.imagePreview.src = '';
        this.imagePreview.classList.add('hidden');
        this.imageInput.value = '';
        this.charCount.textContent = '0/500';
        this.clearErrors();
        if (this.incidentMap) {
            this.incidentMap.reset();
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

        if (!formData.get('incidentType')) errors.incidentType = 'Please select an incident type.';
        if (!formData.get('severity')) errors.severity = 'Please select a severity level.';
        if (!formData.get('latitude') || !formData.get('longitude')) errors.location = 'Please select a location on the map.';
        
        const description = formData.get('description');
        if (description && description.length > 500) errors.description = 'Description must be 500 characters or less.';

        const image = this.imageInput.files[0];
        if (!image) {
            errors.image = 'Please upload an image.';
        } else {
            if (!image.type.startsWith('image/')) errors.image = 'Invalid file type. Please upload an image.';
            if (image.size > 5 * 1024 * 1024) errors.image = 'Image size cannot exceed 5MB.';
        }

        return errors;
    }

    /**
     * Display form errors
     * @param {Object} errors
     * @private
     */
    displayErrors(errors) {
        for (const [field, message] of Object.entries(errors)) {
            const errorElement = document.getElementById(`${field}-error`);
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                const formGroup = errorElement.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('has-error');
                }
            }
        }
    }

    /**
     * Clear form errors
     * @private
     */
    clearErrors() {
        const errorElements = this.form.querySelectorAll('.validation-feedback');
        errorElements.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.remove('has-error'));
        this.messageContainer.innerHTML = '';
        this.messageContainer.className = 'message-container';
    }

    /**
     * Show success/error message
     * @param {string} text
     * @param {'success'|'error'} type
     * @private
     */
    showMessage(text, type) {
        this.messageContainer.textContent = text;
        this.messageContainer.className = `message-container ${type}-message`;
    }

    /**
     * Handle image upload
     * @param {Event} event
     * @private
     */
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            this.imagePreview.classList.add('hidden');
            return;
        }

        const errors = {};
        if (!file.type.startsWith('image/')) errors.image = 'Invalid file type. Please upload an image.';
        if (file.size > 5 * 1024 * 1024) errors.image = 'Image size cannot exceed 5MB.';

        if (Object.keys(errors).length > 0) {
            this.displayErrors(errors);
            this.imageInput.value = '';
            this.imagePreview.classList.add('hidden');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.imagePreview.src = e.target.result;
            this.imagePreview.alt = `Preview of ${file.name}`;
            this.imagePreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    /**
     * Set loading state
     * @param {boolean} isLoading
     * @private
     */
    setLoading(isLoading) {
        this.submitButton.disabled = isLoading;
        const btnText = this.submitButton.querySelector('.btn-text');
        if (isLoading) {
            this.loadingSpinner.classList.remove('hidden');
            if(btnText) btnText.textContent = 'Submitting...';
        } else {
            this.loadingSpinner.classList.add('hidden');
            if(btnText) btnText.textContent = 'Submit Report';
        }
    }
}