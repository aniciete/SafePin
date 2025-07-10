/**
 * Utility class for marker clustering
 */
export class MarkerClusterer {
    static #instance = null;
    static #map = null;

    /**
     * Initialize marker clusterer
     * @param {google.maps.Map} map - Map instance
     * @returns {Promise<void>}
     */
    static async initialize(map) {
        if (this.#instance) {
            return;
        }

        this.#map = map;

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
            this.#instance = new MarkerClusterer({
                map: this.#map,
                markers: [],
                algorithm: new SuperClusterAlgorithm({
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
        if (this.#instance) {
            this.#instance.addMarkers(markers);
        }
    }

    /**
     * Clear all markers from the cluster
     */
    static clearMarkers() {
        if (this.#instance) {
            this.#instance.clearMarkers();
        }
    }

    /**
     * Get the marker clusterer instance
     * @returns {MarkerClusterer|null}
     */
    static getInstance() {
        return this.#instance;
    }
} 