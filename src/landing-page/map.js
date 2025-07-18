import { MapController } from '../components/map.js';

export class IncidentMap {
    constructor(mapElementId, latitudeInputId, longitudeInputId) {
        this.mapController = new MapController(mapElementId);
        this.latitudeInput = document.getElementById(latitudeInputId);
        this.longitudeInput = document.getElementById(longitudeInputId);
        this.currentLocationBtn = document.getElementById('current-location-btn');
        this.marker = null;
        this.initialCenter = { lat: 14.5995, lng: 121.0364 }; // Metro Manila
    }

    async init() {
        try {
            const map = await this.mapController.initMap({
                center: this.initialCenter,
                zoom: 12,
            });

            this.marker = this.mapController.addMarker({
                map,
                position: map.getCenter(),
                gmpDraggable: true,
                title: 'Drag to set incident location',
            });
            this.updateLocationFields(map.getCenter());

            map.addListener('click', (event) => {
                this.marker.position = event.latLng;
                this.updateLocationFields(event.latLng);
            });

            this.marker.addListener('dragend', () => {
                this.updateLocationFields(this.marker.position);
            });

            if (this.currentLocationBtn) {
                this.currentLocationBtn.addEventListener('click', () => this.handleCurrentLocation());
            }

        } catch (error) {
            console.error('Error initializing map:', error);
            throw error;
        }
    }

    updateLocationFields(position) {
        const lat = typeof position.lat === 'function' ? position.lat() : position.lat;
        const lng = typeof position.lng === 'function' ? position.lng() : position.lng;
        this.latitudeInput.value = lat;
        this.longitudeInput.value = lng;
        console.log('Location fields updated:', { lat, lng });
    }

    handleCurrentLocation() {
        console.log('Attempting to get current location...');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPosition = { lat: latitude, lng: longitude };
                    console.log('Successfully retrieved location:', newPosition);

                    this.mapController.getMap().setCenter(newPosition);
                    if (this.marker) {
                        this.marker.position = newPosition;
                    }
                    this.updateLocationFields(newPosition);
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

    reset() {
        if (this.marker) {
            this.marker.position = this.initialCenter;
            this.mapController.getMap().setCenter(this.initialCenter);
            this.updateLocationFields(this.initialCenter);
        }
    }
}