import { useEffect, useRef, useState, useCallback } from 'react';
import mapLoader from '../../services/mapLoader';
import MapViewSkeleton from './MapViewSkeleton';

const getPinColor = (severity) => {
  switch (severity) {
    case 'Critical': return 'hsl(var(--destructive))';
    case 'High': return 'hsl(var(--warning))'; // Assuming you have a warning color
    case 'Medium': return 'hsl(var(--secondary))';
    case 'Low': return 'hsl(var(--primary))';
    default: return 'hsl(var(--muted-foreground))';
  }
};

const MapView = ({ reports, onMarkerClick, onLocationSelect, markerPosition }) => {
  const mapRef = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportMarkersRef = useRef([]);
  const userPinRef = useRef(null);

  const initMap = useCallback(() => {
    mapLoader.load().then(async (google) => {
      const { Map } = await google.maps.importLibrary("maps");
      const map = new Map(mapRef.current, {
        center: markerPosition || { lat: 14.5995, lng: 120.9842 },
        zoom: markerPosition ? 17 : 12,
        mapId: 'SAFE_PIN_MAP',
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
      });
      setGoogleMap(map);
      setLoading(false);

      if (onLocationSelect) {
        map.addListener('click', (e) => {
          onLocationSelect({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        });
      }
    });
  }, [markerPosition, onLocationSelect]);

  useEffect(() => {
    if (!mapRef.current) return;
    initMap();
  }, [initMap]);

  // Effect to manage the single user-placed pin
  useEffect(() => {
    if (!googleMap) return;
    if (markerPosition && markerPosition.lat && markerPosition.lng) {
      mapLoader.load().then(async () => {
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
        if (userPinRef.current) {
          userPinRef.current.position = markerPosition;
        } else {
          userPinRef.current = new AdvancedMarkerElement({
            position: markerPosition,
            map: googleMap,
            title: 'Selected Location',
          });
        }
        googleMap.panTo(markerPosition);
      });
    } else {
      if (userPinRef.current) {
        userPinRef.current.map = null;
        userPinRef.current = null;
      }
    }
  }, [googleMap, markerPosition]);

  // Effect to manage the multiple report markers for dashboards
  useEffect(() => {
    if (!googleMap || !reports) return;
    
    // Clear existing report markers
    reportMarkersRef.current.forEach(marker => marker.map = null);
    reportMarkersRef.current = [];

    mapLoader.load().then(async () => {
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
      reports.forEach(report => {
        if (report.location?.lat && report.location?.lng) {
          const pinElement = document.createElement('div');
          pinElement.className = 'w-6 h-6 rounded-full shadow-lg';
          pinElement.style.backgroundColor = getPinColor(report.severity);
          pinElement.style.border = '2px solid white';
          
          const marker = new AdvancedMarkerElement({
            position: report.location,
            map: googleMap,
            content: pinElement,
            title: report.incident_type,
          });
          
          if (onMarkerClick) {
            marker.addListener('click', () => onMarkerClick(report));
          }
          reportMarkersRef.current.push(marker);
        }
      });
    });
  }, [googleMap, reports, onMarkerClick]);

  return (
    <div className="relative h-full w-full">
      {loading && <MapViewSkeleton />}
      <div ref={mapRef} className={`h-full w-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  );
};

export default MapView;