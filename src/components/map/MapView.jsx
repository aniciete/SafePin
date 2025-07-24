import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import mapLoader from '../../services/mapLoader';
import MapViewSkeleton from './MapViewSkeleton';
import MapMarker from './MapMarker';

const MapView = ({ reports = [], onMarkerClick, onLocationSelect, markerPosition }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userPinRef = useRef(null);
  const userPinRoot = useRef(null);
  const reportMarkersRef = useRef({});
  const reportMarkerRoots = useRef({});

  // This ref will hold the latest version of the onLocationSelect callback.
  // This is the key to breaking the dependency cycle in the main useEffect.
  const onLocationSelectRef = useRef(onLocationSelect);
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  });

  // This effect initializes the map ONCE and ONLY ONCE.
  useEffect(() => {
    if (mapInstanceRef.current) return; // Prevent re-initialization

    let mapClickListener;

    const initializeMap = async () => {
      const { Map } = await google.maps.importLibrary("maps");
      const map = new Map(mapContainerRef.current, {
        center: { lat: 14.5995, lng: 120.9842 },
        zoom: 12,
        mapId: 'fe9a462b09a63dfca63c05a8',
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
      });
      
      mapInstanceRef.current = map;

      // The click listener now safely calls the function from the ref.
      mapClickListener = map.addListener('click', (e) => {
        if (onLocationSelectRef.current) {
          const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          onLocationSelectRef.current(latLng);
        }
      });
    };

    initializeMap();

    return () => {
      if (mapClickListener) mapClickListener.remove();
      if (userPinRoot.current) userPinRoot.current.unmount();
      Object.values(reportMarkerRoots.current).forEach(root => root.unmount());
    };
  }, []); // <-- The empty dependency array is CRITICAL. It ensures this runs only once.

  // This effect handles the user pin and the panning animation.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markerPosition || !markerPosition.lat) return;

    const updateUserPin = async () => {
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      if (userPinRef.current) {
        userPinRef.current.position = markerPosition;
      } else {
        const container = document.createElement('div');
        userPinRoot.current = createRoot(container);
        userPinRoot.current.render(
          <MapMarker severity="Low" pulse={true} title="Selected Location" />
        );
        userPinRef.current = new AdvancedMarkerElement({
          position: markerPosition,
          map: map,
          content: container,
        });
      }

      // The most reliable animation: pan first, then zoom after a delay.
      map.panTo(markerPosition);
      const zoomTimer = setTimeout(() => {
        map.setZoom(17);
      }, 500);
      
      return () => clearTimeout(zoomTimer);
    };

    updateUserPin();
  }, [markerPosition]);

  // This effect handles the dashboard markers.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !reports.length) return;

    // ... (This logic for dashboard markers is fine and does not need changes)
    const updateReportMarkers = async () => {
        Object.values(reportMarkersRef.current).forEach(marker => marker.map = null);
        Object.values(reportMarkerRoots.current).forEach(root => root.unmount());
        reportMarkersRef.current = {};
        reportMarkerRoots.current = {};

        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        
        reports.forEach((report) => {
            if (report.location?.lat && report.location?.lng) {
                const container = document.createElement('div');
                const root = createRoot(container);
                root.render(
                    <MapMarker
                        severity={report.severity}
                        title={report.incident_type}
                        onClick={() => onMarkerClick && onMarkerClick(report)}
                    />
                );
                
                const marker = new AdvancedMarkerElement({
                    position: report.location,
                    map: map,
                    content: container,
                });

                reportMarkersRef.current[report.id] = marker;
                reportMarkerRoots.current[report.id] = root;
            }
        });
    };

    updateReportMarkers();
  }, [reports, onMarkerClick]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default MapView;