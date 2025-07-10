/**
 * Utility class for loading and initializing Google Maps
 */
export class MapLoader {
    /**
     * Load the Google Maps JavaScript API with specified libraries
     * @param {string} apiKey - Google Maps API key
     * @param {Array<string>} [libraries=[]] - Additional libraries to load
     * @returns {Promise<void>}
     */
    static async loadGoogleMaps(apiKey, libraries = []) {
        if (window.google && window.google.maps) {
            return Promise.resolve();
        }

        // Always include the marker library for Advanced Markers
        if (!libraries.includes('marker')) {
            libraries.push('marker');
        }

        const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=beta&libraries=${libraries.join(',')}`;
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.defer = true;
            script.onerror = () => reject(new Error('Failed to load Google Maps API'));
            script.onload = () => resolve();
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize a Google Map instance
     * @param {string} elementId - ID of the map container element
     * @param {Object} options - Map initialization options
     * @returns {Promise<{map: google.maps.Map}>}
     */
    static async initializeMap(elementId, options) {
        const mapElement = document.getElementById(elementId);
        if (!mapElement) {
            throw new Error(`Map container element with id "${elementId}" not found`);
        }

        const map = new google.maps.Map(mapElement, options);
        return { map };
    }
}