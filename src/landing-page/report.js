/**
 * Report page logic for SafePin
 * Handles report submission, validation, and communication with backend
 * @module report
 */
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { signUpWithEmail, signInWithEmail, signInWithGoogle, onAuthStateChange } from '../modules/auth.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js';
import { db } from '../modules/firebase-init.js';
import { checkRateLimit } from './rate-limit.js';

// --- Map variables ---
let map;
let incidentMarker;
let currentLocation = { lat: 14.6042, lng: 120.9822 }; // Manila coordinates as default

// --- Initialize map ---
function initMap() {
    map = L.map('map').setView([currentLocation.lat, currentLocation.lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', (e) => {
        placeIncidentMarker(e.latlng);
        updateAddress(e.latlng);
    });

    getCurrentLocation();
}

// --- Geolocation Functions ---
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setView([currentLocation.lat, currentLocation.lng], 16);
                placeIncidentMarker(L.latLng(currentLocation.lat, currentLocation.lng));
                updateAddress(L.latLng(currentLocation.lat, currentLocation.lng));
            },
            (error) => {
                console.error('Geolocation error:', error);
                // Fallback to default coordinates
                placeIncidentMarker(L.latLng(currentLocation.lat, currentLocation.lng));
                updateAddress(L.latLng(currentLocation.lat, currentLocation.lng));
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        // Fallback to default coordinates
        placeIncidentMarker(L.latLng(currentLocation.lat, currentLocation.lng));
        updateAddress(L.latLng(currentLocation.lat, currentLocation.lng));
    }
}

function placeIncidentMarker(latlng) {
    if (incidentMarker) {
        map.removeLayer(incidentMarker);
    }

    const incidentIcon = L.divIcon({
        className: 'incident-marker',
        html: '<div style="background: #ff4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
    });

    incidentMarker = L.marker(latlng, { 
        icon: incidentIcon,
        draggable: true 
    }).addTo(map);

    incidentMarker.bindPopup('<b>Incident Location</b><br>Drag to adjust').openPopup();

    incidentMarker.on('dragend', (e) => {
        updateAddress(e.target.getLatLng());
    });

    currentLocation = { lat: latlng.lat, lng: latlng.lng };
}

function updateAddress(latlng) {
    const addressBar = document.getElementById('addressBar');
    addressBar.innerHTML = `**Lat: ${latlng.lat.toFixed(6)}, Lng: ${latlng.lng.toFixed(6)}**`;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.display_name) {
                addressBar.innerHTML = `**${data.display_name}**`;
            }
        })
        .catch(error => {
            console.log('Geocoding error:', error);
        });
}

// --- Modal Functionality ---
const confirmModal = document.getElementById('confirmModal');
const successModal = document.getElementById('successModal');
const authorityModal = document.getElementById('authorityModal');

function setupModal(modal, openBtnId, closeBtnId, onOpen, onClose) {
    const openBtn = document.getElementById(openBtnId);
    const closeBtn = document.getElementById(closeBtnId);

    if (openBtn) openBtn.addEventListener('click', () => {
        if(onOpen) onOpen();
        modal.classList.add('active');
    });
    if (closeBtn) closeBtn.addEventListener('click', () => {
        if(onClose) onClose();
        modal.classList.remove('active');
    });
}

setupModal(confirmModal, 'openConfirmModalBtn', 'cancelConfirmBtn');

// --- Report Submission Logic ---
const handleReportSubmission = async () => {
    const confirmButton = document.getElementById('triggerSuccessModalBtn');
    confirmButton.disabled = true;
    confirmButton.textContent = 'Checking...';

    // 0. Rate limit check
    const allowed = await checkRateLimit();
    if (!allowed) {
        confirmButton.disabled = false;
        confirmButton.textContent = 'Confirm';
        return;
    }
    confirmButton.textContent = 'Uploading...';

    // 1. Get form data
    const incidentType = document.getElementById('incident-type').value;
    const severityLevel = document.getElementById('severity-level').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('image-upload').files[0];

    if (!incidentType || !severityLevel || !description || !imageFile) {
        showInlineError('Please fill out all fields and select an image.');
        confirmButton.disabled = false;
        confirmButton.textContent = 'Confirm';
        return;
    }

    try {
        // --- Cloudinary Signed Upload ---
        const functionsInstance = getFunctions();
        const getSignature = httpsCallable(functionsInstance, 'getCloudinarySignature');
        const signatureResp = await getSignature();
        const { cloudName, apiKey, timestamp, signature, folder } = signatureResp.data;

        // 2. Upload image to Cloudinary using the signed parameters
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        if (folder) formData.append('folder', folder);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        // Progress indicator
        showProgress('Uploading image...');
        let cloudinaryData;
        let imageUrl;
        let uploadSuccess = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const cloudinaryResponse = await fetch(cloudinaryUrl, {
                    method: 'POST',
                    body: formData,
                });
                if (!cloudinaryResponse.ok) {
                    const errorData = await cloudinaryResponse.json();
                    throw new Error(`Image upload failed: ${errorData.error.message}`);
                }
                cloudinaryData = await cloudinaryResponse.json();
                imageUrl = cloudinaryData.secure_url;
                uploadSuccess = true;
                break;
            } catch (err) {
                if (attempt === 3) throw err;
                await new Promise(res => setTimeout(res, 1000 * attempt)); // Exponential backoff
            }
        }
        if (!uploadSuccess) throw new Error('Image upload failed after multiple attempts.');

        // 3. Save report to Firestore with retry
        showProgress('Submitting report...');
        let reportSuccess = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await addDoc(collection(db, 'reports'), {
                    incidentType,
                    severityLevel,
                    description,
                    imageUrl,
                    location: currentLocation, // From the map logic
                    status: 'pending_verification',
                    createdAt: serverTimestamp(),
                });
                reportSuccess = true;
                break;
            } catch (err) {
                if (attempt === 3) {
                    // Attempt to delete orphaned image from Cloudinary
                    await cleanupOrphanedImage(imageUrl);
                    throw new Error('Report submission failed after multiple attempts. Your image was not saved.');
                }
                await new Promise(res => setTimeout(res, 1000 * attempt));
            }
        }
        if (!reportSuccess) throw new Error('Report submission failed after multiple attempts.');

        // 4. Show success
        hideProgress();
        confirmModal.classList.remove('active');
        successModal.classList.add('active');

// Helper to cleanup orphaned image
async function cleanupOrphanedImage(imageUrl) {
    if (!imageUrl) return;
    try {
        const functionsInstance = getFunctions();
        const deleteImage = httpsCallable(functionsInstance, 'deleteCloudinaryImage');
        await deleteImage({ imageUrl });
    } catch (e) {
        // Silent fail, but you may want to log this somewhere
        console.warn('Failed to cleanup orphaned Cloudinary image:', e);
    }
}


    } catch (error) {
        hideProgress();
        console.error('Error submitting report:', error);
        showInlineError(`Submission failed: ${error.message}`);
    } finally {
        confirmButton.disabled = false;
        confirmButton.textContent = 'Confirm';
    }
};

// Helper functions for inline error and progress
function showInlineError(message) {
    let errorDiv = document.getElementById('reportFormError');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'reportFormError';
        errorDiv.style.color = 'red';
        errorDiv.style.marginBottom = '10px';
        const form = document.getElementById('reportIncidentForm');
        form.parentNode.insertBefore(errorDiv, form);
    }
    errorDiv.textContent = message;
}
function showProgress(message) {
    let progressDiv = document.getElementById('reportFormProgress');
    if (!progressDiv) {
        progressDiv = document.createElement('div');
        progressDiv.id = 'reportFormProgress';
        progressDiv.style.color = 'green';
        progressDiv.style.marginBottom = '10px';
        const form = document.getElementById('reportIncidentForm');
        form.parentNode.insertBefore(progressDiv, form);
    }
    progressDiv.textContent = message;
}
function hideProgress() {
    const progressDiv = document.getElementById('reportFormProgress');
    if (progressDiv) progressDiv.remove();
}
;

document.getElementById('triggerSuccessModalBtn').addEventListener('click', handleReportSubmission);

window.closeModal = () => {
    successModal.classList.remove('active');
    authorityModal.classList.remove('active');
};

// --- Auth Form Functionality ---
window.switchTab = (tabName) => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.querySelector('.auth-tab[onclick*="login"]');
    const signupTab = document.querySelector('.auth-tab[onclick*="signup"]');

    if (tabName === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
    }
};

function updateAuthStatus(result) {
    const statusDiv = document.getElementById('auth-status');
    if (!statusDiv) return;
    if (result.error) {
        statusDiv.textContent = `Error: ${result.error}`;
        statusDiv.style.color = 'red';
    } else if (result.user) {
        statusDiv.textContent = `Welcome, ${result.user.email}!`;
        statusDiv.style.color = 'green';
    }
}

window.handleAuthorityLogin = async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        await signInWithEmail(email, password);
        window.location.href = '/authority-page/index.html';
    } catch (error) {
        updateAuthStatus({ error: error.message });
    }
};

window.handleAuthoritySignUp = async () => {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    try {
        await signUpWithEmail(email, password);
        window.location.href = '/authority-page/index.html';
    } catch (error) {
        updateAuthStatus({ error: error.message });
    }
};

window.handleAuthorityGoogleSignIn = async () => {
    try {
        await signInWithGoogle();
        window.location.href = '/authority-page/index.html';
    } catch (error) {
        updateAuthStatus({ error: error.message });
    }
};

window.redirectTo = (type) => {
    if (type === 'admin') {
        window.location.href = '/admin-page/project/index.html';
    }
};

// --- Event Listeners ---
document.getElementById('currentLocationBtn').addEventListener('click', getCurrentLocation);

// Initialize map on page load
initMap();
