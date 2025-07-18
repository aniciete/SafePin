/**
 * @fileoverview Unified Map Controller for SafePin.
 * This module is responsible for all map-related functionality,
 * including initialization, marker management, and user interactions.
 * It is designed to be used by both the citizen-facing report submission
 * page and the authority-facing dashboard.
 */

import { Loader } from '@googlemaps/js-api-loader';

const API_KEY = "AIzaSyB-kT4aRY_THYT8Am33VdP21nkwLaR6O8Q";

const loader = new Loader({
    apiKey: API_KEY,
    version: 'weekly',
    libraries: ['marker'],
});

export class MapController {
    constructor(elementId) {
        this.mapElement = document.getElementById(elementId);
        if (!this.mapElement) {
            throw new Error(`Map container element with id "${elementId}" not found`);
        }
        this.map = null;
        this.markers = [];
    }

    /**
     * Initializes the Google Map instance.
     * @param {object} mapOptions - Options for map initialization (center, zoom, etc.).
     * @returns {Promise<google.maps.Map>} The initialized map instance.
     */
    async initMap(mapOptions) {
        await loader.load();
        this.map = new google.maps.Map(this.mapElement, {
            ...mapOptions,
            mapId: '806380e33fb5c6cbb5720fde'
        });
        return this.map;
    }

    /**
     * Adds a marker to the map.
     * @param {object} markerOptions - Options for the marker (position, title, etc.).
     * @returns {google.maps.marker.AdvancedMarkerElement} The created marker instance.
     */
    addMarker(markerOptions) {
        const marker = new google.maps.marker.AdvancedMarkerElement(markerOptions);
        this.markers.push(marker);
        return marker;
    }

    /**
     * Clears all markers from the map.
     */
    clearMarkers() {
        this.markers.forEach(marker => {
            marker.map = null;
        });
        this.markers = [];
    }

    /**
     * Returns the current map instance.
     * @returns {google.maps.Map}
     */
    getMap() {
        return this.map;
    }
}