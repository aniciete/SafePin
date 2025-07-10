// report.js - Fixed version with proper error handling and validation

// Import styles
import './style.css';
import '../utils/auth-styles.css';

// Import utilities
import { UploadError, FormError, MapError, withErrorHandling } from '../utils/errorHandler.js';
import { sanitizeText } from '../utils/security.js';
import { initMap } from './map.controller.js';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '../config/firebase';
import { MapLoader } from '../utils/map-loader';
import { SafePinHeader } from '../components/Header.js';
import { SafePinFooter } from '../components/Footer.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getFirestore(app);
getStorage(app);

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


/**
 * Enhanced form validation with error handling
 */
withErrorHandling(async function() {
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



function clearImageUpload() {
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview) {
        imagePreview.innerHTML = '';
    }
}






/**
 * Enhanced form submission handling
 */

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
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