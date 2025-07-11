/**
 * @fileoverview Map controller for the report page
 * Handles map initialization and marker management
 */

import { MapLoader } from '../utils/map-loader.js';
import { MapError } from '../utils/errorHandler.js';

const MAPS_CONFIG = {
    API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
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

/**
 * Initialize the map
 */
export async function initMap() {
    try {
        // Load Google Maps API
        await MapLoader.loadGoogleMaps(MAPS_CONFIG.API_KEY);

        // Initialize map
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            throw new MapError('Map container not found');
        }

        map = new google.maps.Map(mapElement, {
            center: MAPS_CONFIG.DEFAULT_CENTER,
            zoom: MAPS_CONFIG.DEFAULT_ZOOM,
            restriction: {
                latLngBounds: MAPS_CONFIG.BOUNDS,
                strictBounds: false
            },
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: false,
            mapId: '806380e33fb5c6cabe7df0e4' // Replace with your Map ID
        });

        // Create marker
        marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: map.getCenter(),
            gmpDraggable: true,
            title: 'Drag to set incident location'
        });

        // Add marker drag event listener
        marker.addEventListener('gmp-dragend', () => {
            console.log('Marker dragend event fired');
            const position = marker.getPosition();
            updateAddressBar(position);
            updateLocationField(position);
        });

        // Add click event listener to map
        map.addListener('click', (event) => {
            console.log('Map click event fired');
            const position = event.latLng;
            marker.setPosition(position);
            updateAddressBar(position);
            updateLocationField(position);
        });

        // Initialize current location button
        initCurrentLocationButton();

        console.log('Map initialized successfully');
        return { map, marker };
    } catch (error) {
        console.error('Error initializing map:', error);
        throw new MapError('Failed to initialize map: ' + error.message);
    }
}

/**
 * Update the address bar with the current location
 * @param {google.maps.LatLng} position
 */
async function updateAddressBar(position) {
    try {
        const geocoder = new google.maps.Geocoder();
        const result = await geocoder.geocode({ location: position });
        if (result.results[0]) {
            const address = result.results[0].formatted_address;
            document.getElementById('address-display').textContent = address;
        }
    } catch (error) {
        console.error('Error getting address:', error);
        document.getElementById('address-display').textContent = 'Address not found';
    }
}

/**
 * Update the hidden location field with coordinates
 * @param {google.maps.LatLng} position
 */
function updateLocationField(position) {
    const locationField = document.getElementById('location');
    if (locationField) {
        const location = {
            lat: position.lat(),
            lng: position.lng()
        };
        locationField.value = JSON.stringify(location);
    }
}

/**
 * Initialize the current location button
 */
function initCurrentLocationButton() {
    const currentLocationBtn = document.getElementById('current-location-btn');
    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                currentLocationBtn.disabled = true;
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        map.setCenter(pos);
                        marker.setPosition(pos);
                        updateAddressBar(pos);
                        updateLocationField(pos);
                        currentLocationBtn.disabled = false;
                    },
                    (error) => {
                        console.error('Error getting current location:', error);
                        currentLocationBtn.disabled = false;
                        alert('Error getting your location. Please try again.');
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser');
            }
        });
    }
}