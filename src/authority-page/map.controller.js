// map.controller.js
import { showReportDetail } from './ui.manager.js';
import { MapLoader } from '../utils/map-loader.js';
import { MarkerClusterer } from '../utils/marker-clusterer.js';

let map;
let currentLocation = { lat: 14.6042, lng: 120.9822 }; // Default to Manila

/**
 * Initializes the map.
 */
export async function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error("Map container not found!");
        return;
    }

    try {
        // Load Google Maps API
        await MapLoader.loadGoogleMaps(process.env.GOOGLE_MAPS_API_KEY);

        // Initialize map
        const { map: mapInstance } = await MapLoader.initializeMap('map', {
            center: currentLocation,
            zoom: 15,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        });

        map = mapInstance;

        // Initialize marker clustering
        await MarkerClusterer.initialize(map);

        map.addListener('idle', () => {
            updateAddress(map.getCenter());
        });

        getCurrentLocation();
    } catch (error) {
        console.error('Failed to initialize map:', error);
    }
}

/**
 * Loads report data as markers on the map.
 * @param {Array} reports - An array of report objects.
 */
export function loadReportsOnMap(reports) {
    const mapReportsList = document.getElementById('map-reports-list');
    mapReportsList.innerHTML = '';

    // Clear existing markers
    MarkerClusterer.clearMarkers();

    const markers = reports.map(report => {
        if (report.lat && report.lng) {
            const marker = new google.maps.Marker({
                position: { lat: report.lat, lng: report.lng },
                title: `${report.category} Incident`
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `<b>${report.category} Incident</b><br>${report.street}<br>Status: ${report.progress}`
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });

            const div = document.createElement('div');
            div.className = 'flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100';
            div.innerHTML = `
                <span class="font-semibold text-gray-800">${report.id} - ${report.category}</span>
                <span class="text-gray-700 text-sm">${report.street}</span>
            `;
            div.addEventListener('click', () => {
                showReportDetail(report, 'Map View');
                map.panTo({ lat: report.lat, lng: report.lng });
                map.setZoom(17);
                infoWindow.open(map, marker);
            });
            mapReportsList.appendChild(div);

            return marker;
        }
        return null;
    }).filter(Boolean);

    // Add markers to clusterer
    MarkerClusterer.addMarkers(markers);
}

/**
 * Get user's current location
 */
function getCurrentLocation() {
    if (!navigator.geolocation) {
        console.warn('Geolocation is not supported');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.panTo(currentLocation);
            updateAddress(currentLocation);
        },
        (error) => {
            console.warn('Failed to get current location:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

/**
 * Update address display
 * @param {google.maps.LatLng|{lat: number, lng: number}} location - Location to get address for
 */
function updateAddress(location) {
    const geocoder = new google.maps.Geocoder();
    const addressBar = document.getElementById('addressBar');

    geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results[0]) {
            addressBar.textContent = results[0].formatted_address;
        } else {
            addressBar.textContent = 'Address not found';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const currentLocationBtn = document.getElementById('currentLocationBtn');
  if (currentLocationBtn) {
    currentLocationBtn.addEventListener('click', getCurrentLocation);
  }
});