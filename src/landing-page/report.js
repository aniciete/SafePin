/**
 * @fileoverview Report page logic for SafePin
 * Handles report submission, validation, and map functionality
 * @module report
 */

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';

// Import Firebase services
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { ValidationError, ERROR_SEVERITY } from '../utils/errorHandler.js';
import { checkRateLimit } from './rate-limit.js';

// Constants for validation
const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 1000;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
 * Map Controller - Handles map initialization and interactions
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
                attribution: ' OpenStreetMap contributors',
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
     * Generates a unique anonymous user ID and stores it in session storage.
     * @returns {string} The anonymous user ID.
     */
    getAnonymousUserId() {
        let userId = sessionStorage.getItem('anonymousUserId');
        if (!userId) {
            userId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
            sessionStorage.setItem('anonymousUserId', userId);
        }
        return userId;
    }

    /**
     * Triggers the download of a text file with the report details.
     * @param {object} reportData - The data for the report.
     * @private
     */
    downloadReportAsTxt(reportData) {
        const content = [
            `Incident Report`,
            `---------------------------`,
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
        const openConfirmBtn = document.getElementById('openConfirmModalBtn');
        const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
        const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
        const closeErrorModalBtn = document.getElementById('closeErrorModalBtn');

        openConfirmBtn.addEventListener('click', () => {
            const isValid = this.validateForm(true); // Pass true to show all errors
            if (isValid) {
                this.updateSummary();
                confirmModal.classList.add('visible');
            }
        });

        cancelConfirmBtn.addEventListener('click', () => {
            confirmModal.classList.remove('visible');
        });

        this.confirmBtn.addEventListener('click', async () => {
            await this.submitReport();
        });

        closeSuccessModalBtn.addEventListener('click', () => {
            successModal.classList.remove('visible');
            this.resetForm();
        });

        closeErrorModalBtn.addEventListener('click', () => {
            errorModal.classList.remove('visible');
        });
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
    updateSummary() {
        const location = this.mapController.getLocation();
        document.getElementById('summary-incident-type').textContent = this.incidentType.options[this.incidentType.selectedIndex].text;
        document.getElementById('summary-severity').textContent = this.severityLevel.options[this.severityLevel.selectedIndex].text;
        document.getElementById('summary-location').textContent = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
        document.getElementById('summary-description').textContent = this.description.value.substring(0, 100) + (this.description.value.length > 100 ? '...' : '');
    }

    /**
     * Gathers data, submits the report to Firestore, and handles UI updates.
     * @private
     */
    async submitReport() {
        const submitButton = this.confirmBtn;
        const spinner = submitButton.querySelector('.loading-spinner');
        const btnText = submitButton.querySelector('.btn-text');

        try {
            // Show loading state
            btnText.textContent = 'Submitting...';
            spinner.classList.remove('hidden');
            submitButton.disabled = true;

            // 1. Gather form data
            const location = this.mapController.getLocation();
            const reportData = {
                userId: this.getAnonymousUserId(),
                incidentType: this.incidentType.value,
                severityLevel: this.severityLevel.value,
                description: this.description.value,
                location: {
                    latitude: location.lat,
                    longitude: location.lng,
                },
                createdAt: serverTimestamp(),
                status: 'pending_verification', // Initial status
            };

            // 2. Submit to Firestore
            const reportsCollection = collection(window.db, 'reports');
            const docRef = await addDoc(reportsCollection, reportData);
            console.log('Report submitted with ID: ', docRef.id);

            // 3. Create and download local backup file
            this.downloadReportAsTxt({ ...reportData, id: docRef.id });

            // 4. Show success modal
            document.getElementById('report-id').textContent = `#${docRef.id.substring(0, 8)}`;
            document.getElementById('confirmModal').classList.remove('visible');
            document.getElementById('successModal').classList.add('visible');

        } catch (error) {
            console.error('Submission failed:', error);
            showErrorMessage(new ValidationError(
                'Failed to submit report. Please try again later.',
                ERROR_SEVERITY.CRITICAL
            ));
        } finally {
            // Hide loading state
            btnText.textContent = 'Confirm';
            spinner.classList.add('hidden');
            submitButton.disabled = false;
        }
    }

    /**
     * Resets the form fields and removes any uploaded image.
     * @private
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
