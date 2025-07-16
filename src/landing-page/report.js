// report.js - Fixed version with proper error handling and validation

// Import styles
import './style.css';
import '../utils/auth-styles.css';

// Import utilities
import { UploadError, FormError, MapError, withErrorHandling } from '../utils/errorHandler.js';
import { sanitizeText } from '../utils/security.js';
import { MapController } from '../components/map.js';
import { SafePinHeader } from '../components/Header.js';
import { SafePinFooter } from '../components/Footer.js';
import { FormController } from './form.controller.js';

getStorage(app);

// Load header and footer
(async () => {
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

        // Initialize form controller
        new FormController();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
})();

async function initializePage() {
    try {
        const mapController = new MapController('map');
        const map = await mapController.initMap({
            center: { lat: 14.5995, lng: 121.0364 }, // Metro Manila
            zoom: 12,
        });

        const marker = mapController.addMarker({
            map,
            position: map.getCenter(),
            gmpDraggable: true,
            title: 'Drag to set incident location',
        });
        updateLocationField(map.getCenter());

        map.addListener('click', (event) => {
            marker.position = event.latLng;
            updateLocationField(event.latLng);
        });

        marker.addListener('dragend', () => {
            updateLocationField(marker.position);
        });
 
        const currentLocationBtn = document.getElementById('current-location-btn');
        if (currentLocationBtn) {
            currentLocationBtn.addEventListener('click', () => handleCurrentLocation(mapController));
        }
 
     } catch (error) {
         console.error('Error initializing map:', error);
         throw error;
     }
}

function handleCurrentLocation(mapController) {
    console.log('Attempting to get current location...');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newPosition = { lat: latitude, lng: longitude };
                console.log('Successfully retrieved location:', newPosition);
                
                mapController.getMap().setCenter(newPosition);
                const marker = mapController.markers[0];
                if (marker) {
                    marker.position = newPosition;
                }
                updateLocationField(newPosition);
            },
            (error) => {
                console.error('Error getting current location:', error);
                alert('Could not retrieve your location. Please select it manually on the map.');
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function updateLocationField(position) {
    const locationField = document.getElementById('location');
    if (locationField) {
        const lat = typeof position.lat === 'function' ? position.lat() : position.lat;
        const lng = typeof position.lng === 'function' ? position.lng() : position.lng;
        locationField.value = JSON.stringify({ lat, lng });
        console.log('Location field updated:', locationField.value);
    }
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