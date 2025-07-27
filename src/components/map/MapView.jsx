import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import mapLoader from '../../services/mapLoader';
import MapMarker from './MapMarker';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';

const MapView = React.memo(({
  reports = [],
  isLoading,
  onMarkerClick,
  selectedReportId,
  hoveredReportId,
  initialCenter,
  initialZoom = 12,
  onMapClick,
  panToLocation,
  zoomToLocation, // Accept the new prop
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const clustererRef = useRef(null);
  const markerRootsRef = useRef(new Map());
  const [isMapReady, setIsMapReady] = useState(false);

  const getInitialMapState = () => {
    try {
      const savedCenter = sessionStorage.getItem('mapCenter');
      const savedZoom = sessionStorage.getItem('mapZoom');
      return {
        center: savedCenter ? JSON.parse(savedCenter) : initialCenter || { lat: 14.5995, lng: 120.9842 },
        zoom: savedZoom ? parseInt(savedZoom, 10) : initialZoom,
      };
    } catch (error) {
      console.error("Failed to parse map state from sessionStorage:", error);
      return {
        center: initialCenter || { lat: 14.5995, lng: 120.9842 },
        zoom: initialZoom,
      };
    }
  };

  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    let map;
    const { center, zoom } = getInitialMapState();
    const listeners = [];
    let debounceTimer = null;

    mapLoader.load().then(async (google) => {
      const { Map } = await google.maps.importLibrary("maps");
      
      map = new Map(mapContainerRef.current, {
        center,
        zoom,
        mapId: 'fe9a462b09a63dfca63c05a8',
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
      });
      mapInstanceRef.current = map;

      // --- THIS IS THE FIX (Part 1): Adjust clusterer sensitivity ---
      clustererRef.current = new MarkerClusterer({
        map,
        algorithm: new SuperClusterAlgorithm({
          radius: 40,    // Smaller radius = less clustering
          maxZoom: 16,     // Stop clustering at zoom level 16
        }),
      });

      if (onMapClick) {
        listeners.push(map.addListener('click', (e) => onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() })));
      }

      const saveMapState = () => {
        if (mapInstanceRef.current) {
          const currentCenter = mapInstanceRef.current.getCenter().toJSON();
          const currentZoom = mapInstanceRef.current.getZoom();
          sessionStorage.setItem('mapCenter', JSON.stringify(currentCenter));
          sessionStorage.setItem('mapZoom', currentZoom.toString());
        }
      };
      
      const debouncedSave = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(saveMapState, 500);
      };

      listeners.push(map.addListener('center_changed', debouncedSave));
      listeners.push(map.addListener('zoom_changed', debouncedSave));

      setIsMapReady(true);
    }).catch(e => console.error("API Load Failed:", e));

    return () => {
      listeners.forEach(listener => google.maps.event.removeListener(listener));
      clearTimeout(debounceTimer);
      markerRootsRef.current.forEach(root => root.unmount());
      mapInstanceRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMapClick]);

  useEffect(() => {
    if (!isLoading && isMapReady && mapInstanceRef.current) {
      setTimeout(() => {
        google.maps.event.trigger(mapInstanceRef.current, 'resize');
      }, 50);
    }
  }, [isLoading, isMapReady]);

  useEffect(() => {
    if (isMapReady && mapInstanceRef.current && panToLocation) {
      mapInstanceRef.current.panTo(panToLocation);
    }
  }, [panToLocation, isMapReady]);

  // --- THIS IS THE FIX (Part 2): Add an effect for hover-to-zoom ---
  useEffect(() => {
    if (isMapReady && mapInstanceRef.current && zoomToLocation) {
      mapInstanceRef.current.panTo(zoomToLocation.center);
      mapInstanceRef.current.setZoom(zoomToLocation.zoom);
    }
  }, [zoomToLocation, isMapReady]);

  useEffect(() => {
    if (!isMapReady) return;
    const clusterer = clustererRef.current;
    if (!clusterer) return;

    clusterer.clearMarkers();
    markerRootsRef.current.forEach(root => root.unmount());
    markerRootsRef.current.clear();

    const newMarkers = reports.map(report => {
      if (!report.location?.lat || !report.location?.lng) return null;

      const { AdvancedMarkerElement } = google.maps.marker;
      const container = document.createElement('div');
      const root = createRoot(container);
      
      root.render(
        <MapMarker
          severity={report.severity}
          status={report.status}
          title={report.incident_type_other || report.incident_type}
          onClick={() => onMarkerClick && onMarkerClick(report.id)}
          isSelected={report.id === selectedReportId}
          isHovered={report.id === hoveredReportId}
          isDimmed={hoveredReportId && report.id !== hoveredReportId}
        />
      );

      markerRootsRef.current.set(report.id, root);

      return new AdvancedMarkerElement({
        position: report.location,
        content: container,
      });
    }).filter(Boolean);

    if (newMarkers.length > 0) {
      clusterer.addMarkers(newMarkers);
    }
  }, [reports, selectedReportId, hoveredReportId, onMarkerClick, isMapReady]);

  return <div ref={mapContainerRef} className="h-full w-full rounded-lg overflow-hidden" />;
});

MapView.displayName = 'MapView';
export default MapView;