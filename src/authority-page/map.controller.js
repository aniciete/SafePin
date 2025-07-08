// map.controller.js
import { showReportDetail } from './ui.manager.js';

let map;
let currentLocation = { lat: 14.6042, lng: 120.9822 }; // Default to Manila

/**
 * Initializes the Leaflet map.
 */
export function initMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error("Map container not found!");
    return;
  }
  if (map) {
    map.remove();
  }

  map = L.map('map').setView([currentLocation.lat, currentLocation.lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  map.on('moveend', () => {
    updateAddress(map.getCenter());
  });

  getCurrentLocation();
}

/**
 * Loads report data as markers on the map.
 * @param {Array} reports - An array of report objects.
 */
export function loadReportsOnMap(reports) {
  const mapReportsList = document.getElementById('map-reports-list');
  mapReportsList.innerHTML = '';

  // Clear existing markers
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  reports.forEach(report => {
    if (report.lat && report.lng) {
      const marker = L.marker([report.lat, report.lng]).addTo(map);
      marker.bindPopup(`<b>${report.category} Incident</b><br>${report.street}<br>Status: ${report.progress}`);

      const div = document.createElement('div');
      div.className = 'flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100';
      div.innerHTML = `
        <span class="font-semibold text-gray-800">${report.id} - ${report.category}</span>
        <span class="text-gray-700 text-sm">${report.street}</span>
      `;
      div.addEventListener('click', () => {
        showReportDetail(report, 'Map View');
        map.flyTo([report.lat, report.lng], 17);
        marker.openPopup();
      });
      mapReportsList.appendChild(div);
    }
  });
}

/**
 * Gets the user's current location using the Geolocation API.
 */
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setView([currentLocation.lat, currentLocation.lng], 16);
        updateAddress(L.latLng(currentLocation.lat, currentLocation.lng));
      },
      (error) => {
        console.log('Geolocation error:', error);
        updateAddress(L.latLng(currentLocation.lat, currentLocation.lng));
      }
    );
  } else {
    console.log('Geolocation not supported');
    updateAddress(L.latLng(currentLocation.lat, currentLocation.lng));
  }
}

/**
 * Updates the address display using reverse geocoding.
 * @param {L.LatLng} latlng - The latitude and longitude.
 */
function updateAddress(latlng) {
  const addressBar = document.getElementById('addressBar');
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`)
    .then(response => response.json())
    .then(data => {
      if (data && data.display_name) {
        addressBar.innerHTML = `**${data.display_name}**`;
      } else {
        addressBar.innerHTML = `**Lat: ${latlng.lat.toFixed(6)}, Lng: ${latlng.lng.toFixed(6)}**`;
      }
    })
    .catch(error => {
      console.log('Geocoding error:', error);
      addressBar.innerHTML = `**Lat: ${latlng.lat.toFixed(6)}, Lng: ${latlng.lng.toFixed(6)}**`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const currentLocationBtn = document.getElementById('currentLocationBtn');
  if (currentLocationBtn) {
    currentLocationBtn.addEventListener('click', getCurrentLocation);
  }
});