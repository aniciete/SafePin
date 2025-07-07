/**
 * @fileoverview Report page logic for SafePin
 * Handles report submission, validation, and map functionality
 * @module report
 */

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import { signUpWithEmail, signInWithEmail, signInWithGoogle, onAuthStateChange } from '../services/auth.service.js';
import { db } from '../config/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ValidationError, ERROR_SEVERITY } from '../utils/errorHandler.js';

// Constants for validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_DESCRIPTION_LENGTH = 1000;
const MIN_DESCRIPTION_LENGTH = 20;

// Add marker cluster styles
const markerClusterStyles = `
.marker-cluster-small {
    background-color: rgba(181, 226, 140, 0.6);
}
.marker-cluster-small div {
    background-color: rgba(110, 204, 57, 0.6);
}
.marker-cluster-medium {
    background-color: rgba(241, 211, 87, 0.6);
}
.marker-cluster-medium div {
    background-color: rgba(240, 194, 12, 0.6);
}
.marker-cluster-large {
    background-color: rgba(253, 156, 115, 0.6);
}
.marker-cluster-large div {
    background-color: rgba(241, 128, 23, 0.6);
}
.marker-cluster {
    background-clip: padding-box;
    border-radius: 20px;
}
.marker-cluster div {
    width: 30px;
    height: 30px;
    margin-left: 5px;
    margin-top: 5px;
    text-align: center;
    border-radius: 15px;
    font: 12px "Helvetica Neue", Arial, Helvetica, sans-serif;
}
.marker-cluster span {
    line-height: 30px;
}
`;

// Add styles to document
if (!document.getElementById('marker-cluster-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'marker-cluster-styles';
    styleSheet.textContent = markerClusterStyles;
    document.head.appendChild(styleSheet);
}

/**
 * Map Controller - Handles all map-related functionality
 */
class MapController {
    constructor() {
        this.map = null;
        this.incidentMarker = null;
        this.markerCluster = null;
        this.currentLocation = { lat: 14.6042, lng: 120.9822 }; // Manila coordinates as default
        this.mapInitialized = false;
        this.mapContainer = document.getElementById('map');
        this.addressBar = document.getElementById('addressBar');
        
        // Bind methods
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleMarkerDragEnd = this.handleMarkerDragEnd.bind(this);
        
        // Initialize map when container is visible
        if (this.mapContainer) {
            this.setupIntersectionObserver();
        }
    }

    /**
     * Setup Intersection Observer for lazy loading
     * @private
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.mapInitialized) {
                    this.initMap();
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        observer.observe(this.mapContainer);
    }

    /**
     * Initialize the map
     * @private
     */
    async initMap() {
        try {
            // Create map instance
            this.map = L.map(this.mapContainer, {
                zoomControl: true,
                scrollWheelZoom: true,
                keyboard: true
            }).setView([this.currentLocation.lat, this.currentLocation.lng], 15);

            // Add tile layer with error handling
            await this.addTileLayer();

            // Initialize marker cluster group
            this.markerCluster = L.markerClusterGroup({
                chunkedLoading: true,
                maxClusterRadius: 50,
                spiderfyOnMaxZoom: true,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                iconCreateFunction: function(cluster) {
                    const count = cluster.getChildCount();
                    let size = 'small';
                    
                    if (count > 100) {
                        size = 'large';
                    } else if (count > 10) {
                        size = 'medium';
                    }
                    
                    return L.divIcon({
                        html: `<div><span>${count}</span></div>`,
                        className: `marker-cluster marker-cluster-${size}`,
                        iconSize: L.point(40, 40)
                    });
                }
            });
            this.map.addLayer(this.markerCluster);

            // Setup event listeners
            this.map.on('click', this.handleMapClick);
            
            // Get current location
            await this.getCurrentLocation();
            
            this.mapInitialized = true;
        } catch (error) {
            console.error('Map initialization failed:', error);
            showErrorMessage(new ValidationError(
                'Failed to initialize map. Please refresh the page.',
                ERROR_SEVERITY.HIGH
            ));
        }
    }

    /**
     * Add tile layer with error handling
     * @private
     */
    async addTileLayer() {
        return new Promise((resolve, reject) => {
            const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
                minZoom: 3
            });

            tileLayer.on('tileerror', (error) => {
                console.error('Tile loading error:', error);
                reject(new Error('Failed to load map tiles'));
            });

            tileLayer.on('load', () => {
                resolve();
            });

            tileLayer.addTo(this.map);
        });
    }

    /**
     * Handle map click events
     * @private
     * @param {L.MouseEvent} e - Leaflet mouse event
     */
    handleMapClick(e) {
        this.placeIncidentMarker(e.latlng);
        this.updateAddress(e.latlng);
    }

    /**
     * Handle marker drag end events
     * @private
     * @param {L.DragEndEvent} e - Leaflet drag end event
     */
    handleMarkerDragEnd(e) {
        this.updateAddress(e.target.getLatLng());
    }

    /**
     * Get current location with error handling
     * @private
     */
    async getCurrentLocation() {
        if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported by this browser.');
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });

            this.currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            this.map.setView([this.currentLocation.lat, this.currentLocation.lng], 16);
            this.placeIncidentMarker(L.latLng(this.currentLocation.lat, this.currentLocation.lng));
            await this.updateAddress(L.latLng(this.currentLocation.lat, this.currentLocation.lng));
        } catch (error) {
            console.warn('Geolocation error:', error);
            // Fallback to default location
            this.placeIncidentMarker(L.latLng(this.currentLocation.lat, this.currentLocation.lng));
            await this.updateAddress(L.latLng(this.currentLocation.lat, this.currentLocation.lng));
        }
    }

    /**
     * Place or update incident marker
     * @private
     * @param {L.LatLng} latlng - Coordinates for marker
     */
    placeIncidentMarker(latlng) {
        if (this.incidentMarker) {
            this.markerCluster.removeLayer(this.incidentMarker);
        }

        const incidentIcon = L.divIcon({
            className: 'incident-marker',
            html: `
                <div style="
                    background: #ff4444;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "
                role="img"
                aria-label="Incident location marker">
                </div>
            `,
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });

        this.incidentMarker = L.marker(latlng, {
            icon: incidentIcon,
            draggable: true,
            keyboard: true,
            title: 'Drag to adjust incident location'
        });

        this.incidentMarker.on('dragend', this.handleMarkerDragEnd);
        this.incidentMarker.bindPopup('<b>Incident Location</b><br>Drag to adjust', {
            offset: [0, -10],
            closeButton: false
        });

        this.markerCluster.addLayer(this.incidentMarker);
        this.currentLocation = { lat: latlng.lat, lng: latlng.lng };
    }

    /**
     * Update address display with reverse geocoding
     * @private
     * @param {L.LatLng} latlng - Coordinates to geocode
     */
    async updateAddress(latlng) {
        if (!this.addressBar) return;

        this.addressBar.innerHTML = `<em>Loading address...</em>`;
        
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`,
                {
                    headers: {
                        'Accept-Language': 'en-US,en;q=0.9',
                        'User-Agent': 'SafePin-App/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Geocoding request failed');
            }

            const data = await response.json();
            
            if (data && data.display_name) {
                this.addressBar.innerHTML = `<strong>${data.display_name}</strong>`;
            } else {
                throw new Error('No address found');
            }
        } catch (error) {
            console.warn('Geocoding error:', error);
            this.addressBar.innerHTML = `<strong>Lat: ${latlng.lat.toFixed(6)}, Lng: ${latlng.lng.toFixed(6)}</strong>`;
        }
    }

    /**
     * Clean up map resources
     * @public
     */
    cleanup() {
        if (this.map) {
            this.map.remove();
            this.map = null;
            this.incidentMarker = null;
            this.markerCluster = null;
            this.mapInitialized = false;
        }
    }

    /**
     * Get current incident location
     * @public
     * @returns {Object} Current location coordinates
     */
    getLocation() {
        return this.currentLocation;
    }
}

/**
 * Report Controller - Handles report submission and form management
 */
class ReportController {
    constructor(mapController) {
        this.mapController = mapController;
        this.form = document.getElementById('reportIncidentForm');
        this.incidentType = document.getElementById('incident-type');
        this.severityLevel = document.getElementById('severity-level');
        this.description = document.getElementById('description');
        this.imageUpload = document.getElementById('image-upload');
        this.imagePreview = document.getElementById('image-preview');
        this.fileName = document.querySelector('.file-name');
        this.fileSize = document.querySelector('.file-size');
        this.removeImageBtn = document.getElementById('remove-image');
        this.submitBtn = document.getElementById('openConfirmModalBtn');
        this.confirmBtn = document.getElementById('triggerSuccessModalBtn');
        this.validationMessage = document.getElementById('form-validation-message');
        this.descriptionLength = document.getElementById('description-length');
        
        this.setupEventListeners();
        this.setupFormValidation();
    }

    /**
     * Setup event listeners for form elements and modals
     * @private
     */
    setupEventListeners() {
        // Form field validation
        this.form.addEventListener('input', this.handleFormInput.bind(this));
        this.description.addEventListener('input', this.updateCharacterCount.bind(this));
        
        // Image upload handling
        this.imageUpload.addEventListener('change', this.handleImageUpload.bind(this));
        this.removeImageBtn.addEventListener('click', this.handleImageRemove.bind(this));
        
        // Modal handling
        const confirmModal = document.getElementById('confirmModal');
        const successModal = document.getElementById('successModal');
        const errorModal = document.getElementById('errorModal');
        
        this.setupModal(confirmModal, 'openConfirmModalBtn', 'cancelConfirmBtn', 
            () => this.updateReportSummary());
        
        // Setup form submission
        this.confirmBtn.addEventListener('click', () => this.handleReportSubmission());
        
        // Close modals on success/error
        document.getElementById('closeSuccessModalBtn').addEventListener('click', 
            () => successModal.classList.remove('active'));
        document.getElementById('closeErrorModalBtn').addEventListener('click', 
            () => errorModal.classList.remove('active'));
    }

    /**
     * Setup modal functionality
     * @private
     */
    setupModal(modal, openBtnId, closeBtnId, onOpen, onClose) {
        const openBtn = document.getElementById(openBtnId);
        const closeBtn = document.getElementById(closeBtnId);

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                if (onOpen) onOpen();
                modal.classList.add('active');
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (onClose) onClose();
                modal.classList.remove('active');
            });
        }
    }

    /**
     * Setup form validation
     * @private
     */
    setupFormValidation() {
        this.form.setAttribute('novalidate', true);
        this.addValidationListeners(this.incidentType);
        this.addValidationListeners(this.severityLevel);
        this.addValidationListeners(this.description);
        this.addValidationListeners(this.imageUpload);
    }

    /**
     * Add validation listeners to a form field
     * @private
     * @param {HTMLElement} field - Form field to validate
     */
    addValidationListeners(field) {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => this.validateField(field));
    }

    /**
     * Validate a single form field
     * @private
     * @param {HTMLElement} field - Form field to validate
     * @returns {boolean} - Whether the field is valid
     */
    validateField(field) {
        const formGroup = field.closest('.form-group');
        const feedback = formGroup.querySelector('.validation-feedback');
        let isValid = true;
        let message = '';

        // Clear previous validation
        formGroup.classList.remove('has-error');
        feedback.textContent = '';

        // Required field validation
        if (field.required && !field.value) {
            isValid = false;
            message = 'This field is required';
        }

        // Field-specific validation
        switch (field.id) {
            case 'description':
                if (field.value.length < MIN_DESCRIPTION_LENGTH) {
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
            feedback.textContent = message;
        }

        return isValid;
    }

    /**
     * Validate all form fields
     * @private
     * @returns {boolean} - Whether all fields are valid
     */
    validateForm() {
        const fields = [this.incidentType, this.severityLevel, this.description, this.imageUpload];
        const isValid = fields.every(field => this.validateField(field));

        if (!isValid) {
            this.showValidationMessage('Please fix the errors before submitting', 'error');
        }

        return isValid;
    }

    /**
     * Handle form input events
     * @private
     * @param {Event} event - Input event
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
     * @param {Event} event - Change event
     */
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        if (this.validateField(this.imageUpload)) {
            // Show preview
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
     * @param {number} bytes - File size in bytes
     * @returns {string} - Formatted file size
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
     * @param {string} message - Message to display
     * @param {string} type - Message type ('error' or 'success')
     */
    showValidationMessage(message, type = 'error') {
        this.validationMessage.textContent = message;
        this.validationMessage.className = `validation-message ${type}`;
        this.validationMessage.classList.remove('hidden');
    }

    /**
     * Update report summary in confirmation modal
     * @private
     */
    updateReportSummary() {
        const location = this.mapController.getLocation();
        document.getElementById('summary-incident-type').textContent = this.incidentType.options[this.incidentType.selectedIndex].text;
        document.getElementById('summary-severity').textContent = this.severityLevel.options[this.severityLevel.selectedIndex].text;
        document.getElementById('summary-location').textContent = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
        document.getElementById('summary-description').textContent = this.description.value.substring(0, 100) + (this.description.value.length > 100 ? '...' : '');
    }

    /**
     * Handle report submission
     * @private
     */
    async handleReportSubmission() {
        const confirmButton = document.getElementById('triggerSuccessModalBtn');
        const confirmModal = document.getElementById('confirmModal');
        const successModal = document.getElementById('successModal');
        const errorModal = document.getElementById('errorModal');

        if (!confirmButton) return;

        try {
            // Disable button and show loading state
            confirmButton.disabled = true;
            confirmButton.querySelector('.btn-text').classList.add('hidden');
            confirmButton.querySelector('.loading-spinner').classList.remove('hidden');

            // Rate limit check
            const allowed = await checkRateLimit();
            if (!allowed) {
                throw new ValidationError(
                    'Too many reports submitted. Please try again later.',
                    ERROR_SEVERITY.MEDIUM
                );
            }

            // Get form data
            const formData = this.getFormData();
            if (!formData.isValid) {
                throw new ValidationError(
                    formData.error,
                    ERROR_SEVERITY.MEDIUM
                );
            }

            // Upload image
            const imageUrl = await this.uploadImage(formData.imageFile);

            // Submit report
            const reportRef = await this.submitReport({
                ...formData,
                imageUrl,
                location: this.mapController.getLocation()
            });

            // Show success
            confirmModal.classList.remove('active');
            document.getElementById('report-id').textContent = `#${reportRef.id}`;
            successModal.classList.add('active');

        } catch (error) {
            // Show error modal
            confirmModal.classList.remove('active');
            document.getElementById('error-message').textContent = error.message;
            errorModal.classList.add('active');
        } finally {
            // Reset button state
            confirmButton.disabled = false;
            confirmButton.querySelector('.btn-text').classList.remove('hidden');
            confirmButton.querySelector('.loading-spinner').classList.add('hidden');
        }
    }

    /**
     * Get and validate form data
     * @private
     * @returns {Object} Form data and validation status
     */
    getFormData() {
        const incidentType = document.getElementById('incident-type')?.value;
        const severityLevel = document.getElementById('severity-level')?.value;
        const description = document.getElementById('description')?.value;
        const imageFile = document.getElementById('image-upload')?.files[0];

        if (!incidentType || !severityLevel || !description || !imageFile) {
            return {
                isValid: false,
                error: 'Please fill out all fields and select an image.'
            };
        }

        return {
            isValid: true,
            incidentType,
            severityLevel,
            description,
            imageFile
        };
    }

    /**
     * Upload image to Cloudinary
     * @private
     * @param {File} imageFile - Image file to upload
     * @returns {Promise<string>} Uploaded image URL
     */
    async uploadImage(imageFile) {
        const getSignature = httpsCallable(functions, 'getCloudinarySignature');
        
        try {
            const signatureResp = await getSignature({ file: imageFile });
            const { cloudName, apiKey, timestamp, signature, folder } = signatureResp.data;

            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('api_key', apiKey);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);
            if (folder) formData.append('folder', folder);

            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            
            // Upload with retry
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    const response = await fetch(cloudinaryUrl, {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error?.message || 'Image upload failed');
                    }

                    const data = await response.json();
                    return data.secure_url;
                } catch (err) {
                    if (attempt === 3) throw err;
                    await new Promise(res => setTimeout(res, 1000 * attempt));
                }
            }

            throw new Error('Image upload failed after multiple attempts');
        } catch (error) {
            throw new ValidationError(
                'Failed to upload image. Please try again.',
                ERROR_SEVERITY.HIGH
            );
        }
    }

    /**
     * Submit report to Firestore
     * @private
     * @param {Object} reportData - Report data to submit
     * @returns {Promise<DocumentReference>} - Firestore document reference
     */
    async submitReport(reportData) {
        try {
            // Generate a random user ID (no login required)
            const anonymousUserId = 'anon_' + Math.random().toString(36).substring(2, 15);
            
            // Prepare report data
            const report = {
                userId: anonymousUserId,
                timestamp: serverTimestamp(),
                location: {
                    latitude: reportData.location.lat,
                    longitude: reportData.location.lng
                },
                incidentType: reportData.incidentType,
                severityLevel: reportData.severityLevel,
                description: reportData.description,
                status: 'pending_verification' // Initial status
            };

            // Add document to Firestore
            const reportsRef = collection(db, 'reports');
            const docRef = await addDoc(reportsRef, report);
            return docRef;
        } catch (error) {
            console.error('Error submitting report:', error);
            throw new ValidationError(
                'Failed to submit report. Please try again.',
                ERROR_SEVERITY.HIGH
            );
        }
    }

    /**
     * Cleanup orphaned Cloudinary image
     * @private
     * @param {string} imageUrl - URL of image to delete
     */
    async cleanupOrphanedImage(imageUrl) {
        if (!imageUrl) return;
        
        try {
            const deleteImage = httpsCallable(functions, 'deleteCloudinaryImage');
            await deleteImage({ imageUrl });
        } catch (error) {
            console.warn('Failed to cleanup orphaned image:', error);
        }
    }
}

// Initialize controllers when DOM is ready
let mapController;
let reportController;

document.addEventListener('DOMContentLoaded', () => {
    mapController = new MapController();
    reportController = new ReportController(mapController);
});

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (mapController) {
        mapController.cleanup();
    }
});
