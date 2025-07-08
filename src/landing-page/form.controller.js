/**
 * @fileoverview Form Controller for SafePin report page.
 * Handles form validation, input events, and image handling.
 * @module form.controller
 */

// Constants for validation
const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 1000;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export class FormController {
    constructor() {
        this.form = document.getElementById('reportIncidentForm');
        this.incidentType = document.getElementById('incident-type');
        this.severityLevel = document.getElementById('severity-level');
        this.description = document.getElementById('description');
        this.imageUpload = document.getElementById('image-upload');
        this.imagePreview = document.getElementById('image-preview');
        this.fileName = document.querySelector('.file-name');
        this.fileSize = document.querySelector('.file-size');
        this.removeImageBtn = document.getElementById('remove-image');
        this.validationMessage = document.getElementById('form-validation-message');
        this.descriptionLength = document.getElementById('description-length');

        if (this.form) {
            this.setupEventListeners();
        }
    }

    /**
     * Setup event listeners for form elements
     * @private
     */
    setupEventListeners() {
        this.form.setAttribute('novalidate', true);
        this.form.addEventListener('input', this.handleFormInput.bind(this));
        this.description.addEventListener('input', this.updateCharacterCount.bind(this));
        this.imageUpload.addEventListener('change', this.handleImageUpload.bind(this));
        this.removeImageBtn.addEventListener('click', this.handleImageRemove.bind(this));

        this.addValidationListeners(this.incidentType);
        this.addValidationListeners(this.severityLevel);
        this.addValidationListeners(this.description);
        this.addValidationListeners(this.imageUpload);
    }

    /**
     * Add validation listeners to a form field
     * @private
     */
    addValidationListeners(field) {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => this.validateField(field));
    }

    /**
     * Validate a single form field
     * @private
     */
    validateField(field) {
        const formGroup = field.closest('.form-group, .file-upload-container');
        if (!formGroup) return true;
        const feedback = formGroup.querySelector('.validation-feedback');
        let isValid = true;
        let message = '';

        // Clear previous validation
        formGroup.classList.remove('has-error');
        if (feedback) feedback.textContent = '';

        // Required field validation
        if (field.required && !field.value && field.type !== 'file') {
            isValid = false;
            message = 'This field is required';
        } else if (field.required && field.type === 'file' && field.files.length === 0) {
            isValid = false;
            message = 'An image is required';
        }

        // Field-specific validation
        switch (field.id) {
            case 'description':
                if (field.value.length > 0 && field.value.length < MIN_DESCRIPTION_LENGTH) {
                    isValid = false;
                    message = `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`;
                } else if (field.value.length > MAX_DESCRIPTION_LENGTH) {
                    isValid = false;
                    message = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`;
                }
                break;
            
            case 'image-upload':
                if (field.files.length > 0) {
                    const file = field.files[0];
                    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                        isValid = false;
                        message = 'Please upload a valid image file (JPG, PNG, or GIF)';
                    } else if (file.size > MAX_FILE_SIZE) {
                        isValid = false;
                        message = 'File size cannot exceed 5MB';
                    }
                }
                break;
        }

        // Update UI
        if (!isValid) {
            formGroup.classList.add('has-error');
            if (feedback) feedback.textContent = message;
        }

        return isValid;
    }

    /**
     * Validate all form fields
     * @public
     */
    validateForm() {
        const fields = [this.incidentType, this.severityLevel, this.description, this.imageUpload];
        const isFormValid = fields.every(field => this.validateField(field));

        if (!isFormValid) {
            this.showValidationMessage('Please fix the errors before submitting', 'error');
        } else {
            this.validationMessage.classList.add('hidden');
        }
        
        return isFormValid;
    }

    /**
     * Handle form input events
     * @private
     */
    handleFormInput(event) {
        const field = event.target;
        if (field.id) {
            this.validateField(field);
        }
    }

    /**
     * Update character count for description
     * @private
     */
    updateCharacterCount() {
        const length = this.description.value.length;
        this.descriptionLength.textContent = length;
        
        if (length > MAX_DESCRIPTION_LENGTH) {
            this.descriptionLength.style.color = '#dc2626';
        } else {
            this.descriptionLength.style.color = '';
        }
    }

    /**
     * Handle image upload
     * @private
     */
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (this.validateField(this.imageUpload)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreview.src = e.target.result;
                this.imagePreview.classList.remove('hidden');
                this.fileName.textContent = file.name;
                this.fileSize.textContent = this.formatFileSize(file.size);
                this.removeImageBtn.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    }

    /**
     * Handle image removal
     * @private
     */
    handleImageRemove() {
        this.imageUpload.value = '';
        this.imagePreview.src = '';
        this.imagePreview.classList.add('hidden');
        this.fileName.textContent = '';
        this.fileSize.textContent = '';
        this.removeImageBtn.classList.add('hidden');
        this.validateField(this.imageUpload);
    }

    /**
     * Format file size in human-readable format
     * @private
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Show validation message
     * @private
     */
    showValidationMessage(message, type = 'error') {
        this.validationMessage.textContent = message;
        this.validationMessage.className = `validation-message ${type}`;
        this.validationMessage.classList.remove('hidden');
    }

    /**
     * Gathers and returns the form data.
     * @public
     */
    getFormData() {
        return {
            incidentType: this.incidentType.value,
            severityLevel: this.severityLevel.value,
            description: this.description.value,
            imageFile: this.imageUpload.files[0],
        };
    }

    /**
     * Resets the form fields and removes any uploaded image.
     * @public
     */
    resetForm() {
        this.form.reset();
        this.imagePreview.src = '';
        this.imagePreview.classList.add('hidden');
        this.fileName.textContent = '';
        this.fileSize.textContent = '';
        this.removeImageBtn.classList.add('hidden');
        this.validateField(this.imageUpload);
    }
}