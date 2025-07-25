import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import mapLoader from '../../services/mapLoader';
import MapMarker from './MapMarker';

const MapView = React.memo(({ reports = [], onMarkerClick, selectedReportId, hoveredReportId, initialCenter, initialZoom = 12 }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const reportMarkersRef = useRef({});
  const reportMarkerRoots = useRef({});
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Effect for initializing the map
  useEffect(() => {
    if (mapInstanceRef.current) return;
    mapLoader.load().then(async (google) => {
      const { Map } = await google.maps.importLibrary("maps");
      const center = initialCenter || { lat: 14.5995, lng: 120.9842 };
      const map = new Map(mapContainerRef.current, {
        center: center,
        zoom: initialCenter ? initialZoom : 12,
        mapId: 'fe9a462b09a63dfca63c05a8',
        disableDefaultUI: true, zoomControl: true, gestureHandling: 'cooperative',
      });
      mapInstanceRef.current = map;
      setIsMapInitialized(true);
    }).catch(e => console.error("API Load Failed:", e));
    return () => { Object.values(reportMarkerRoots.current).forEach(root => root.unmount()); };
  }, [initialCenter, initialZoom]);

  // Effect for adding/removing/updating markers
  useEffect(() => {
    if (!isMapInitialized) return;
    const map = mapInstanceRef.current;
    const existingMarkerIds = Object.keys(reportMarkersRef.current);
    const newReportIds = reports.map(r => r.id);

    existingMarkerIds.forEach(id => {
      if (!newReportIds.includes(id)) {
        reportMarkersRef.current[id].map = null;
        reportMarkerRoots.current[id].unmount();
        delete reportMarkersRef.current[id];
        delete reportMarkerRoots.current[id];
      }
    });

    const updateMarkers = async () => {
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      reports.forEach((report) => {
        if (report.location?.lat && report.location?.lng) {
          if (!reportMarkersRef.current[report.id]) {
            const container = document.createElement('div');
            const root = createRoot(container);
            const marker = new AdvancedMarkerElement({ position: report.location, map, content: container });
            reportMarkersRef.current[report.id] = marker;
            reportMarkerRoots.current[report.id] = root;
          }
          // Render the React component for the marker's content
          reportMarkerRoots.current[report.id].render(
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
    };
    updateMarkers();
  }, [isMapInitialized, reports, onMarkerClick, selectedReportId, hoveredReportId]);

  // --- THIS IS THE NEW, DEDICATED EFFECT FOR Z-INDEX ---
  useEffect(() => {
    if (!isMapInitialized) return;
    Object.entries(reportMarkersRef.current).forEach(([id, marker]) => {
      const isSelected = id === selectedReportId;
      const isHovered = id === hoveredReportId;
      
      if (isSelected) {
        marker.zIndex = 100; // Selected is always on top
      } else if (isHovered) {
        marker.zIndex = 50;  // Hovered is next
      } else {
        marker.zIndex = 1;   // Default is at the bottom
      }
    });
  }, [isMapInitialized, selectedReportId, hoveredReportId]);


  return <div ref={mapContainerRef} className="h-full w-full rounded-lg overflow-hidden" />;
});

MapView.displayName = 'MapView';
export default MapView;