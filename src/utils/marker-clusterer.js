/**
 * Utility class for marker clustering
 */
export class MarkerClusterer {

    /**
     * Initialize marker clusterer
     * @param {google.maps.Map} map - Map instance
     * @returns {Promise<void>}
     */
    static async initialize(map) {
        if (MarkerClusterer._instance) {
            return;
        }

        MarkerClusterer._map = map;

        try {
            // Load MarkerClusterer script
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
                script.async = true;
                script.onload = resolve;
                script.onerror = () => reject(new Error('Failed to load MarkerClusterer'));
                document.head.appendChild(script);
            });

            // Initialize clusterer
            this._instance = new window.markerClusterer.MarkerClusterer({
                map: this._map,
                markers: [],
                algorithm: new window.markerClusterer.SuperClusterAlgorithm({
                    radius: 60,
                    maxZoom: 16
                }),
                renderer: {
                    render: ({ count, position }) => {
                        return new google.maps.Marker({
                            position,
                            label: {
                                text: String(count),
                                color: 'white',
                                fontSize: '13px'
                            },
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 20,
                                fillColor: '#4285F4',
                                fillOpacity: 0.9,
                                strokeWeight: 2,
                                strokeColor: '#ffffff'
                            }
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Failed to initialize marker clustering:', error);
            throw error;
        }
    }

    /**
     * Add markers to the cluster
     * @param {Array<google.maps.Marker>} markers - Array of markers to add
     */
    static addMarkers(markers) {
        if (MarkerClusterer._instance) {
            MarkerClusterer._instance.addMarkers(markers);
        }
    }

    /**
     * Clear all markers from the cluster
     */
    static clearMarkers() {
        if (MarkerClusterer._instance) {
            MarkerClusterer._instance.clearMarkers();
        }
    }

    /**
     * Get the marker clusterer instance
     * @returns {MarkerClusterer|null}
     */
    static getInstance() {
        return MarkerClusterer._instance;
    }
}

MarkerClusterer._instance = null;
MarkerClusterer._map = null;