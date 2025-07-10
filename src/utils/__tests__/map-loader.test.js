import { MapLoader } from '../map-loader';
import '@testing-library/jest-dom';

describe('MapLoader Integration', () => {
    let mapLoader;
    let mockGoogleMaps;

    beforeEach(() => {
        // Mock Google Maps API
        mockGoogleMaps = {
            maps: {
                Map: jest.fn(),
                LatLng: jest.fn(),
                Marker: jest.fn(),
                MarkerClusterer: jest.fn(),
                event: {
                    addListener: jest.fn(),
                    removeListener: jest.fn()
                },
                MapTypeId: {
                    ROADMAP: 'roadmap'
                }
            }
        };

        // Mock the global window object
        global.window = {
            google: mockGoogleMaps
        };

        // Create container element
        document.body.innerHTML = '<div id="map"></div>';
        mapLoader = new MapLoader('map');
    });

    afterEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });

    test('initializes map with correct configuration', async () => {
        const config = {
            center: { lat: 14.6091, lng: 121.0223 }, // Metro Manila
            zoom: 11,
            minZoom: 10,
            maxZoom: 18,
            restriction: {
                latLngBounds: {
                    north: 14.8527,
                    south: 14.3502,
                    east: 121.2011,
                    west: 120.8850
                }
            }
        };

        await mapLoader.initializeMap(config);

        expect(mockGoogleMaps.maps.Map).toHaveBeenCalledWith(
            document.getElementById('map'),
            expect.objectContaining(config)
        );
    });

    test('handles marker clustering correctly', async () => {
        await mapLoader.initializeMap();

        const markers = [
            { lat: 14.6091, lng: 121.0223 },
            { lat: 14.6092, lng: 121.0224 }
        ];

        await mapLoader.addMarkers(markers);

        expect(mockGoogleMaps.maps.Marker).toHaveBeenCalledTimes(markers.length);
        expect(mockGoogleMaps.maps.MarkerClusterer).toHaveBeenCalled();
    });

    test('handles map bounds restriction', async () => {
        const config = {
            restriction: {
                latLngBounds: {
                    north: 14.8527,
                    south: 14.3502,
                    east: 121.2011,
                    west: 120.8850
                }
            }
        };

        await mapLoader.initializeMap(config);

        expect(mockGoogleMaps.maps.Map).toHaveBeenCalledWith(
            expect.any(Element),
            expect.objectContaining({
                restriction: config.restriction
            })
        );
    });

    test('handles marker click events', async () => {
        const mockCallback = jest.fn();
        await mapLoader.initializeMap();

        const marker = { lat: 14.6091, lng: 121.0223 };
        await mapLoader.addMarker(marker, mockCallback);

        expect(mockGoogleMaps.maps.event.addListener).toHaveBeenCalledWith(
            expect.any(Object),
            'click',
            mockCallback
        );
    });

    test('cleans up markers correctly', async () => {
        await mapLoader.initializeMap();

        const markers = [
            { lat: 14.6091, lng: 121.0223 },
            { lat: 14.6092, lng: 121.0224 }
        ];

        await mapLoader.addMarkers(markers);
        mapLoader.clearMarkers();

        // Each marker should have its setMap called with null
        const mockMarkerInstances = mockGoogleMaps.maps.Marker.mock.instances;
        mockMarkerInstances.forEach(marker => {
            expect(marker.setMap).toHaveBeenCalledWith(null);
        });
    });

    test('handles map load errors gracefully', async () => {
        // Simulate Google Maps load error
        delete global.window.google;

        await expect(mapLoader.initializeMap()).rejects.toThrow(
            'Google Maps API not loaded'
        );
    });

    test('updates map center correctly', async () => {
        await mapLoader.initializeMap();

        const newCenter = { lat: 14.6091, lng: 121.0223 };
        await mapLoader.setCenter(newCenter);

        expect(mockGoogleMaps.maps.LatLng).toHaveBeenCalledWith(
            newCenter.lat,
            newCenter.lng
        );
    });

    test('handles marker info windows', async () => {
        await mapLoader.initializeMap();

        const marker = {
            lat: 14.6091,
            lng: 121.0223,
            info: 'Test Info'
        };

        await mapLoader.addMarkerWithInfo(marker);

        expect(mockGoogleMaps.maps.InfoWindow).toHaveBeenCalledWith({
            content: marker.info
        });
    });
}); 