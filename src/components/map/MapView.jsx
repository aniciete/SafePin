import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import mapLoader from '../../services/mapLoader';
import MapMarker from './MapMarker';

const MapView = React.memo(({
  reports = [],
  onMarkerClick,
  selectedReportId,
  hoveredReportId,
  initialCenter,
  initialZoom = 12,
  onMapClick,
  panToLocation
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const markerRootsRef = useRef(new Map());

  // Effect for initializing the map ONCE.
  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    let map;
    mapLoader.load().then(async (google) => {
      const { Map } = await google.maps.importLibrary("maps");
      const center = initialCenter || { lat: 14.5995, lng: 120.9842 };
      
      map = new Map(mapContainerRef.current, {
        center: center,
        zoom: initialZoom,
        mapId: 'fe9a462b09a63dfca63c05a8',
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
      });
      mapInstanceRef.current = map;

      if (onMapClick) {
        map.addListener('click', (e) => {
          onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        });
      }
    }).catch(e => console.error("API Load Failed:", e));

    return () => {
      if (map) google.maps.event.clearInstanceListeners(map);
      markerRootsRef.current.forEach(root => root.unmount());
      mapInstanceRef.current = null;
    };
  }, [initialCenter, initialZoom, onMapClick]);

  // Effect to handle panning the map smoothly.
  useEffect(() => {
    if (mapInstanceRef.current && panToLocation) {
      mapInstanceRef.current.panTo(panToLocation);
    }
  }, [panToLocation]);

  // Effect to intelligently add, update, or remove markers without re-rendering the map.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const reportIds = new Set(reports.map(r => r.id));

    markersRef.current.forEach((marker, id) => {
      if (!reportIds.has(id)) {
        marker.map = null;
        markerRootsRef.current.get(id)?.unmount();
        markersRef.current.delete(id);
        markerRootsRef.current.delete(id);
      }
    });

    reports.forEach(async (report) => {
      if (!report.location?.lat || !report.location?.lng) return;

      const existingMarker = markersRef.current.get(report.id);

      if (existingMarker) {
        const oldPos = existingMarker.position;
        const newPos = report.location;
        if (oldPos.lat !== newPos.lat || oldPos.lng !== newPos.lng) {
          existingMarker.position = newPos;
        }
      } else {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const container = document.createElement('div');
        const root = createRoot(container);
        
        const newMarker = new AdvancedMarkerElement({
          position: report.location,
          map,
          content: container,
        });
        
        markersRef.current.set(report.id, newMarker);
        markerRootsRef.current.set(report.id, root);
      }
      
      const root = markerRootsRef.current.get(report.id);
      if(root) {
        root.render(
          <MapMarker
            severity={report.severity}
            status={report.status}
            title={report.incident_type}
            onClick={() => onMarkerClick && onMarkerClick(report)}
            isSelected={report.id === selectedReportId}
            isHovered={report.id === hoveredReportId}
            isDimmed={hoveredReportId && report.id !== hoveredReportId}
          />
        );
      }
    });

  }, [reports, onMarkerClick, selectedReportId, hoveredReportId]);

  return <div ref={mapContainerRef} className="h-full w-full rounded-lg overflow-hidden" />;
});

MapView.displayName = 'MapView';
export default MapView;