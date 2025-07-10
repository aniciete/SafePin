// map-initializer.js
import { MapLoader } from '../utils/map-loader.js';

const MAPS_CONFIG = {
    API_KEY: 'AIzaSyCJg_Q-5GlDaZAPTTUFe8Lk1hzz0-K4BvM',
    MAP_ID: '806380e33fb5c6cabe7df0e4', // SafePin Map ID
    DEFAULT_CENTER: { lat: 14.5995, lng: 121.0364 }, // Metro Manila
    DEFAULT_ZOOM: 12,
    BOUNDS: {
        north: 14.7565, // Metro Manila bounds
        south: 14.4755,
        east: 121.0851,
        west: 120.9321
    }
};

let map;
let marker;
let geocoder;

// Initialize map when the script loads
async function initializeMap() {
    try {
        // Load Google Maps API with Advanced Markers
        await MapLoader.loadGoogleMaps(MAPS_CONFIG.API_KEY, ['marker']);

        // Initialize map
        const { map: mapInstance } = await MapLoader.initializeMap('map', {
            mapId: MAPS_CONFIG.MAP_ID,
            center: MAPS_CONFIG.DEFAULT_CENTER,
            zoom: MAPS_CONFIG.DEFAULT_ZOOM,
            restriction: {
                latLngBounds: MAPS_CONFIG.BOUNDS,
                strictBounds: true
            },
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
        });

        // Store map instance
        map = mapInstance;
        geocoder = new google.maps.Geocoder();

        // Add click listener to map
        map.addListener('click', (event) => {
            if (isWithinManilaBounds(event.latLng)) {
                placeIncidentMarker(event.latLng);
            } else {
                alert('Please select a location within Metro Manila.');
            }
        });

        // Set up current location button
        setupCurrentLocationButton();
        
        console.log('Map initialized successfully');
    } catch (error) {
        console.error('Error initializing map:', error);
        handleMapError();
    }
}

// Function to check if location is within Manila bounds
function isWithinManilaBounds(latLng) {
    const manilaBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(MAPS_CONFIG.BOUNDS.south, MAPS_CONFIG.BOUNDS.west),
        new google.maps.LatLng(MAPS_CONFIG.BOUNDS.north, MAPS_CONFIG.BOUNDS.east)
    );
    return manilaBounds.contains(latLng);
}

// Function to build marker content
function buildMarkerContent(isCurrentLocation = false) {
    const pinElement = document.createElement('div');
    pinElement.className = `custom-pin ${isCurrentLocation ? 'current-location-pin' : ''}`;
    
    const pinBackground = document.createElement('div');
    pinBackground.className = 'pin-background';
    
    const pinIcon = document.createElement('div');
    pinIcon.className = 'pin-icon';
    pinIcon.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
    `;
    
    pinElement.appendChild(pinBackground);
    pinElement.appendChild(pinIcon);
    
    return pinElement;
}

// Function to place incident marker
function placeIncidentMarker(location, isCurrentLocation = false) {
    // Remove existing marker
    if (marker) {
        marker.map = null;
    }
    
    // Create new Advanced Marker
    const markerView = new google.maps.marker.AdvancedMarkerView({
        map,
        position: location,
        title: isCurrentLocation ? 'Current Location' : 'Incident Location',
        content: buildMarkerContent(isCurrentLocation)
    });
    
    // Make the marker draggable
    const element = markerView.element;
    element.style.cursor = 'grab';
    
    let isDragging = false;
    let dragStartPosition;
    
    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartPosition = { x: e.clientX, y: e.clientY };
        element.style.cursor = 'grabbing';
    });
    
    element.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const dx = e.clientX - dragStartPosition.x;
        const dy = e.clientY - dragStartPosition.y;
        const scale = Math.pow(2, map.getZoom());
        const position = markerView.position;
        
        const newPosition = new google.maps.LatLng(
            position.lat() - (dy / scale),
            position.lng() + (dx / scale)
        );
        
        if (isWithinManilaBounds(newPosition)) {
            markerView.position = newPosition;
            dragStartPosition = { x: e.clientX, y: e.clientY };
            updateLocationField(newPosition);
        }
    });
    
    element.addEventListener('mouseup', () => {
        isDragging = false;
        element.style.cursor = 'grab';
        const position = markerView.position;
        updateAddress(position);
    });
    
    // Store marker reference
    marker = markerView;
    
    // Update address and center map
    updateAddress(location);
    map.setCenter(location);
    
    // Update form field if exists
    updateLocationField(location);
}

// Function to update location field
function updateLocationField(location) {
    const locationField = document.getElementById('selected-location');
    if (locationField) {
        locationField.value = JSON.stringify({
            lat: location.lat(),
            lng: location.lng()
        });
    }
}

// Function to update address display
async function updateAddress(location) {
    const addressBar = document.getElementById('addressBar');
    if (!addressBar) return;
    
    try {
        const result = await geocoder.geocode({ location });
        if (result.results[0]) {
            addressBar.textContent = result.results[0].formatted_address;
        } else {
            addressBar.textContent = `Location: ${location.lat().toFixed(6)}, ${location.lng().toFixed(6)}`;
        }
    } catch (error) {
        console.error('Geocoding failed:', error);
        addressBar.textContent = `Location: ${location.lat().toFixed(6)}, ${location.lng().toFixed(6)}`;
    }
}

// Function to handle map errors
function handleMapError() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.innerHTML = `
            <div class="map-error">
                <p>Failed to load map. Please try again later.</p>
                <button onclick="initializeMap()">Retry</button>
            </div>
        `;
    }
}

// Function to set up current location button
function setupCurrentLocationButton() {
    const currentLocationBtn = document.getElementById('current-location-btn');
    if (!currentLocationBtn) return;
    
    currentLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            currentLocationBtn.disabled = true;
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = new google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    
                    if (isWithinManilaBounds(location)) {
                        placeIncidentMarker(location, true);
                    } else {
                        alert('Your current location is outside Metro Manila. Using default location.');
                        placeIncidentMarker(
                            new google.maps.LatLng(MAPS_CONFIG.DEFAULT_CENTER.lat, MAPS_CONFIG.DEFAULT_CENTER.lng)
                        );
                    }
                    currentLocationBtn.disabled = false;
                },
                (error) => {
                    console.error('Error getting current location:', error);
                    alert('Could not get your current location. Please try selecting a location on the map.');
                    currentLocationBtn.disabled = false;
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    });
}

// Initialize map when the page loads
window.addEventListener('load', initializeMap);

// Export functions that might be needed by other modules
export {
    initializeMap,
    placeIncidentMarker,
    isWithinManilaBounds
};