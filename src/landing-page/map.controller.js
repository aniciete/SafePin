/**
 * @fileoverview Map Controller for SafePin report page using Google Maps API.
 * Handles map initialization, markers, and geocoding.
 * @module map.controller
 */

/**
 * Map Controller - Handles Google Maps initialization and interactions.
 */
export class MapController {
    constructor() {
        this.map = null;
        this.incidentMarker = null;
        this.geocoder = null;
        this.currentLocation = { lat: 14.6042, lng: 120.9822 }; // Default: Manila
        this.mapInitialized = false;
        this.mapContainer = document.getElementById('map');
        this.addressBar = document.getElementById('addressBar');

        // Bind methods to ensure 'this' context is correct
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleMarkerDragEnd = this.handleMarkerDragEnd.bind(this);
        this.handleCurrentLocationClick = this.handleCurrentLocationClick.bind(this);

        // This promise ensures that methods depending on the map
        // do not run until it is fully initialized.
        this.initPromise = this._initialize();

        const currentLocationBtn = document.getElementById('currentLocationBtn');
        if (currentLocationBtn) {
            currentLocationBtn.addEventListener('click', this.handleCurrentLocationClick);
        }
    }

    /**
     * Initializes the controller by waiting for the Google Maps API to be ready,
     * then setting up the map.
     * @private
     */
    async _initialize() {
        try {
            await this._waitForGoogleMaps();
            this._initMap();
        } catch (error) {
            console.error("Map initialization failed:", error);
            this.showErrorModal("Could not load the map. Please check your connection and try again.");
        }
    }

    /**
     * Waits for the global 'google' object to become available.
     * @private
     * @returns {Promise<void>} A promise that resolves when the API is ready.
     */
    _waitForGoogleMaps() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const checkGoogle = () => {
                if (window.google && window.google.maps) {
                    resolve();
                } else if (attempts < 100) { // Timeout after 10 seconds
                    attempts++;
                    setTimeout(checkGoogle, 100);
                } else {
                    reject(new Error("Google Maps API failed to load."));
                }
            };
            checkGoogle();
        });
    }

    /**
     * Sets up the Google Map, geocoder, and initial event listeners.
     * @private
     */
    _initMap() {
        if (this.mapInitialized || !this.mapContainer) return;

        this.geocoder = new google.maps.Geocoder();
        this.map = new google.maps.Map(this.mapContainer, {
            center: this.currentLocation,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
        });

        this.map.addListener('click', this.handleMapClick);
        this.mapInitialized = true;

        // Attempt to fetch the user's location upon initialization.
        this.getCurrentLocation();
    }

    /**
     * Handles clicks on the map to place the incident marker.
     * @param {google.maps.MapMouseEvent} e - The map click event.
     */
    handleMapClick(e) {
        this.placeIncidentMarker(e.latLng);
        this.updateAddress(e.latLng);
    }

    /**
     * Handles the end of a marker drag event.
     * @param {google.maps.MapMouseEvent} e - The marker drag event.
     */
    handleMarkerDragEnd(e) {
        this.updateAddress(e.latLng);
    }

    /**
     * Places or moves the incident marker on the map.
     * @param {google.maps.LatLng} latLng - The coordinates for the marker.
     */
    placeIncidentMarker(latLng) {
        this.currentLocation = { lat: latLng.lat(), lng: latLng.lng() };

        if (this.incidentMarker) {
            this.incidentMarker.setPosition(latLng);
        } else {
            this.incidentMarker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                draggable: true,
                title: 'Drag to adjust incident location',
                // Custom icon to match the previous style
                icon: {
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor: '#ff4444',
                    fillOpacity: 1,
                    strokeWeight: 0,
                    rotation: 0,
                    scale: 1.5,
                    anchor: new google.maps.Point(12, 24),
                },
            });
            this.incidentMarker.addListener('dragend', this.handleMarkerDragEnd);
        }
    }

    /**
     * Updates the address display using the Google Maps Geocoding service.
     * @param {google.maps.LatLng} latLng - The coordinates to geocode.
     */
    async updateAddress(latLng) {
        if (!this.addressBar) return;
        this.addressBar.innerHTML = `<em>Loading address...</em>`;

        try {
            const response = await this.geocoder.geocode({ location: latLng });
            if (response.results && response.results[0]) {
                this.addressBar.innerHTML = `<strong>${response.results[0].formatted_address}</strong>`;
            } else {
                throw new Error('No address found for this location.');
            }
        } catch (error) {
            console.warn('Geocoding error:', error);
            this.addressBar.innerHTML = `<strong>Lat: ${latLng.lat().toFixed(6)}, Lng: ${latLng.lng().toFixed(6)}</strong>`;
        }
    }

    /**
     * Handles the click event for the 'Use Current Location' button.
     */
    async handleCurrentLocationClick() {
        const btn = document.getElementById('currentLocationBtn');
        const btnText = btn.querySelector('.btn-text');
        const spinner = btn.querySelector('.loading-spinner');

        btnText.textContent = 'Fetching...';
        spinner.classList.remove('hidden');

        try {
            await this.getCurrentLocation();
        } catch (error) {
            console.error('Error getting current location:', error);
        } finally {
            btnText.textContent = 'Using current location';
            spinner.classList.add('hidden');
        }
    }

    /**
     * Fetches the user's current geolocation and updates the map.
     */
    async getCurrentLocation() {
        await this.initPromise; // Ensure map is ready before proceeding.

        if (!navigator.geolocation) {
            this.showErrorModal('Geolocation is not supported by this browser.');
            this._fallBackToDefaultLocation();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                const latLng = new google.maps.LatLng(pos.lat, pos.lng);
                this.map.setCenter(pos);
                this.map.setZoom(16);
                this.placeIncidentMarker(latLng);
                this.updateAddress(latLng);
            },
            (error) => {
                let message = 'Could not get current location. Please enable location services.';
                if (error.code === 2) {
                    message = 'Location information is unavailable. Check your network and try again.';
                }
                this.showErrorModal(message);
                this._fallBackToDefaultLocation();
            }
        );
    }

    /**
     * Sets the map to the default location if geolocation fails.
     * @private
     */
    _fallBackToDefaultLocation() {
        const latLng = new google.maps.LatLng(this.currentLocation.lat, this.currentLocation.lng);
        this.map.setCenter(latLng);
        this.placeIncidentMarker(latLng);
        this.updateAddress(latLng);
    }

    /**
     * Gets the current incident location. This is the public method used by other modules.
     * @public
     * @returns {{lat: number, lng: number}} The current coordinates.
     */
    getLocation() {
        return this.currentLocation;
    }

    /**
     * Shows an error modal with a specific message.
     * @param {string} message - The error message to display.
     */
    showErrorModal(message) {
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('error-message');
        if (errorModal && errorMessage) {
            errorMessage.textContent = message;
            errorModal.style.display = 'flex';
        }
    }
}