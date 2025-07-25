import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import mapLoader from '../../services/mapLoader';
import MapViewSkeleton from './MapViewSkeleton';
import MapMarker from './MapMarker';

const MapView = ({ reports = [], onMarkerClick, onLocationSelect, markerPosition, selectedReportId }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userPinRef = useRef(null);
  const userPinRoot = useRef(null);
  const reportMarkersRef = useRef({});
  const reportMarkerRoots = useRef({});
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    mapLoader.load().then(async (google) => {
      const { Map } = await google.maps.importLibrary("maps");
      const map = new Map(mapContainerRef.current, {
        center: { lat: 14.5995, lng: 120.9842 },
        zoom: 12,
        mapId: 'fe9a462b09a63dfca63c05a8',
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
      });
      
      map.addListener('click', (e) => {
        if (onLocationSelect) {
          const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          onLocationSelect(latLng);
        }
      });

      mapInstanceRef.current = map;
      setIsMapInitialized(true);
    }).catch(e => console.error("API Load Failed:", e));

    return () => {
      if (userPinRoot.current) userPinRoot.current.unmount();
      Object.values(reportMarkerRoots.current).forEach(root => root.unmount());
    };
  }, [onLocationSelect]);

  useEffect(() => {
    if (!isMapInitialized || !markerPosition) {
      return;
    }
    
    const map = mapInstanceRef.current;

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
          gmpDraggable: true,
        });
        userPinRef.current.addListener('dragend', (event) => {
          const newPosition = event.latLng;
          if (onLocationSelect && newPosition) {
            onLocationSelect({ lat: newPosition.lat(), lng: newPosition.lng() });
          }
        });
      }
      map.moveCamera({ center: markerPosition, zoom: 17 });
    };

    updateUserPin();
    
  }, [isMapInitialized, markerPosition]);

  useEffect(() => {
    if (!isMapInitialized) return;
    
    const map = mapInstanceRef.current;
    
    const updateReportMarkers = async () => {
      Object.values(reportMarkersRef.current).forEach(marker => marker.map = null);
      Object.values(reportMarkerRoots.current).forEach(root => root.unmount());
      reportMarkersRef.current = {};
      reportMarkerRoots.current = {};

      if (!reports || reports.length === 0) return;

      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      
      reports.forEach((report) => {
        if (report.location?.lat && report.location?.lng) {
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <MapMarker
              severity={report.severity}
              status={report.status}
              title={report.incident_type}
              onClick={() => onMarkerClick && onMarkerClick(report)}
              isSelected={report.id === selectedReportId}
            />
          );
          
          const marker = new AdvancedMarkerElement({
            position: report.location,
            map: map,
            content: container,
            zIndex: report.id === selectedReportId ? 99 : 1,
          });

          reportMarkersRef.current[report.id] = marker;
          reportMarkerRoots.current[report.id] = root;
        }
      });
    };
    updateReportMarkers();
  }, [isMapInitialized, reports, onMarkerClick, selectedReportId]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default MapView;