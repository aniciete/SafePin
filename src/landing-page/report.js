// report.js - Fixed version with proper error handling and validation

// Import styles
import './style.css';
import './report-styles.css';
import '../utils/auth-styles.css';

// Import utilities
import { ValidationError, UploadError, FormError, MapError, withErrorHandling } from '../utils/errorHandler.js';
import { sanitizeText } from '../utils/security.js';
import { initMap } from './map.controller.js';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '../config/firebase';
import { MapLoader } from '../utils/map-loader';
import { SafePinHeader } from '../modules/header';
import { SafePinFooter } from '../modules/footer';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Load header and footer
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize header and footer
        const headerContainer = document.getElementById('header-container');
        const footerContainer = document.getElementById('footer-container');
        
        if (headerContainer) {
            const header = new SafePinHeader();
            header.init();
        }
        if (footerContainer) {
            const footer = new SafePinFooter();
            footer.init();
        }

        // Initialize map
        await initializePage();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

async function initializePage() {
    try {
        // Load Google Maps script using MapLoader
        await MapLoader.loadGoogleMaps('AIzaSyCJg_Q-5GlDaZAPTTUFe8Lk1hzz0-K4BvM');
        
        // Initialize map after script is loaded
        await initMap();

    } catch (error) {
        console.error('Error initializing map:', error);
        throw error;
    }
}

function initializeFormHandlers(map) {
    const form = document.getElementById('reportIncidentForm');
    const openModalBtn = document.getElementById('openConfirmModalBtn');
    
    if (openModalBtn) {
        openModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateForm()) {
                populateConfirmationModal();
                showModal('confirmModal');
            }
        });
    }
    
    // Add real-time validation
    const requiredFields = ['incident-type', 'severity-level', 'description', 'image-upload'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('change', () => validateField(field));
            field.addEventListener('blur', () => validateField(field));
        }
    });
}

/**
 * Enhanced form validation with error handling
 */
const validateForm = withErrorHandling(async function() {
    const formData = new FormData(document.getElementById('reportIncidentForm'));
    const validationErrors = {};
    
    // Validate and sanitize description
    const description = sanitizeText(formData.get('description'));
    if (!description) {
        validationErrors.description = 'Description is required';
    } else if (description.length < 20) {
        validationErrors.description = 'Description must be at least 20 characters long';
    }
    
    // Validate incident type
    const incidentType = formData.get('incident-type');
    if (!incidentType) {
        validationErrors.incidentType = 'Please select an incident type';
    }
    
    // Validate severity level
    const severityLevel = formData.get('severity-level');
    if (!severityLevel) {
        validationErrors.severityLevel = 'Please select a severity level';
    }
    
    // Validate location
    const locationField = document.getElementById('selected-location');
    if (!locationField || !locationField.value) {
        throw new MapError('Please select a location on the map');
    }
    
    // Validate image
    const imageFile = formData.get('image-upload');
    if (!imageFile) {
        validationErrors.image = 'Please upload an image';
    } else {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (imageFile.size > maxSize) {
            throw new UploadError('Image file is too large', imageFile, maxSize);
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(imageFile.type)) {
            throw new UploadError('Invalid image format. Please use JPG, PNG, or GIF', imageFile);
        }
    }
    
    // If there are validation errors, throw FormError
    if (Object.keys(validationErrors).length > 0) {
        throw new FormError('Please fix the form errors', formData, validationErrors);
    }
    
    return true;
});

function validateField(field) {
    const fieldId = field.id;
    let isValid = true;
    
    switch (fieldId) {
        case 'incident-type':
        case 'severity-level':
            if (!field.value) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
            break;
            
        case 'description':
            if (!field.value.trim()) {
                showFieldError(field, 'Description is required');
                isValid = false;
            } else if (field.value.trim().length < 20) {
                showFieldError(field, 'Description must be at least 20 characters long');
                isValid = false;
            } else {
                clearFieldError(field);
            }
            break;
            
        case 'image-upload':
            if (!field.files || field.files.length === 0) {
                showFieldError(field, 'Please upload an image');
                isValid = false;
            } else {
                const file = field.files[0];
                if (file.size > 5 * 1024 * 1024) {
                    showFieldError(field, 'Image file must be less than 5MB');
                    isValid = false;
                } else {
                    clearFieldError(field);
                }
            }
            break;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const feedbackElement = field.parentElement.querySelector('.validation-feedback');
    if (feedbackElement) {
        feedbackElement.textContent = message;
        feedbackElement.style.display = 'block';
        feedbackElement.style.color = '#dc3545';
    }
    field.classList.add('error');
}

function clearFieldError(field) {
    const feedbackElement = field.parentElement.querySelector('.validation-feedback');
    if (feedbackElement) {
        feedbackElement.style.display = 'none';
    }
    field.classList.remove('error');
}

function clearValidationMessages() {
    const feedbackElements = document.querySelectorAll('.validation-feedback');
    feedbackElements.forEach(element => {
        element.style.display = 'none';
    });
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

function showValidationError(message) {
    const validationMessage = document.getElementById('form-validation-message');
    if (validationMessage) {
        validationMessage.textContent = message;
        validationMessage.classList.remove('hidden');
        validationMessage.style.color = '#dc3545';
        validationMessage.style.padding = '12px';
        validationMessage.style.backgroundColor = '#f8d7da';
        validationMessage.style.border = '1px solid #f5c6cb';
        validationMessage.style.borderRadius = '4px';
        validationMessage.style.marginBottom = '16px';
    }
}

function initializeImageUpload() {
    const imageInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Preview of the incident image to be uploaded';
                    imagePreview.innerHTML = '';
                    imagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function clearImageUpload() {
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview) {
        imagePreview.innerHTML = '';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function initializeDescriptionCounter() {
    const description = document.getElementById('description');
    const counter = document.querySelector('.character-count');

    if (description && counter) {
        description.addEventListener('input', () => {
            const count = description.value.length;
            counter.textContent = `${count}/500`;
        });
    }
}

function initializeLocationButton(map) {
    const locationButton = document.getElementById('locate-me-btn');
    if (locationButton) {
        locationButton.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        const marker = new google.maps.Marker({
                            position: { lat: lat, lng: lng },
                            map: map,
                            title: 'Your Location'
                        });
                        map.setCenter(marker.getPosition());
                        map.setZoom(15);
                        document.getElementById('selected-location').value = `${lat},${lng}`;
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        alert('Failed to get your location. Please ensure location services are enabled.');
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser.');
            }
        });
    }
}

function setupModalHandlers() {
    const confirmModal = document.getElementById('confirmModal');
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    
    // Close modals when clicking outside
    [confirmModal, successModal, errorModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    modal.classList.remove('active');
                }
            });
        }
    });
    
    // Close buttons
    const closeButtons = document.querySelectorAll('[id$="ModalBtn"]');
    closeButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function() {
                const modalId = this.id.replace('close', '').replace('Btn', '');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        }
    });
}

function populateConfirmationModal() {
    const form = document.getElementById('reportIncidentForm');
    const summary = document.getElementById('report-summary');
    
    if (form && summary) {
        const incidentType = form.querySelector('#incident-type').value;
        const severityLevel = form.querySelector('#severity-level').value;
        const description = form.querySelector('#description').value;
        const location = form.querySelector('#selected-location').value;
        
        summary.innerHTML = `
            <div class="summary-item">
                <strong>Incident Type:</strong> ${incidentType}
            </div>
            <div class="summary-item">
                <strong>Severity Level:</strong> ${severityLevel}
            </div>
            <div class="summary-item">
                <strong>Location:</strong> ${location}
            </div>
            <div class="summary-item">
                <strong>Description:</strong> ${description}
            </div>
        `;
    }
}

/**
 * Enhanced form submission handling
 */
const handleFormSubmission = withErrorHandling(async function() {
    try {
        // Validate form
        const validatedData = await validateForm();
        
        // Show confirmation modal
        showModal('confirmModal');
        
        // TODO: Implement actual form submission
        // This would typically involve calling your backend API
        
        return true;
    } catch (error) {
        if (error instanceof FormError) {
            // Form validation errors are already handled by the recovery system
            return false;
        }
        throw error; // Re-throw other errors
    }
}, {
    recovery: true,
    notify: true
});

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function resetForm() {
    const form = document.getElementById('reportIncidentForm');
    if (form) {
        form.reset();
    }
    
    // Clear image upload
    clearImageUpload();
    
    // Reset character counter
    const charCount = document.getElementById('description-length');
    if (charCount) {
        charCount.textContent = '0';
        charCount.style.color = '#6c757d';
    }
    
    // Clear validation messages
    clearValidationMessages();
    
    // Reset map marker (if function exists)
    if (window.resetMapMarker) {
        window.resetMapMarker();
    }
}

function showErrorModal(message) {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    showModal('errorModal');
}

// Export functions that might be needed by other modules
window.showErrorModal = showErrorModal;
window.resetForm = resetForm;