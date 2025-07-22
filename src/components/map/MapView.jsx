import { useEffect, useRef, useState } from 'react';
import mapLoader from '../../services/mapLoader';
import MapViewSkeleton from './MapViewSkeleton';

const getPinColor = (severity) => {
  switch (severity) {
    case 'Critical':
      return 'var(--color-neutral-900)';
    case 'High':
      return 'var(--color-neutral-700)';
    case 'Medium':
      return 'var(--color-neutral-500)';
    case 'Low':
      return 'var(--color-neutral-300)';
    default:
      return 'var(--color-neutral-400)';
  }
};

const MapView = ({ reports, onMarkerClick, showHeatmap = false, onLocationSelect }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const markersRef = useRef([]);
  const heatmapRef = useRef(null);
  const userPinRef = useRef(null); // Ref to store the user-placed pin

  useEffect(() => {
    mapLoader.load().then(async (google) => {
      const { Map } = await google.maps.importLibrary("maps");
      const { HeatmapLayer } = await google.maps.importLibrary("visualization");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      
      const newMap = new Map(mapRef.current, {
        center: { lat: 12.8797, lng: 121.774 },
        zoom: 6,
        mapId: 'SAFE_PIN_MAP',
        disableDefaultUI: true,
        zoomControl: true,
      });
      setMap(newMap);
      setLoading(false);

      heatmapRef.current = new HeatmapLayer({
        map: newMap,
        radius: 20,
      });

      // Add a click listener to the map for placing a pin
      if (onLocationSelect) {
        newMap.addListener('click', (e) => {
          const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };

          // If a pin already exists, remove it from the map
          if (userPinRef.current) {
            userPinRef.current.setMap(null);
          }

          // Create a new marker for the selected location
          const newPin = new AdvancedMarkerElement({
            position: location,
            map: newMap,
            title: 'Selected Location',
          });
          
          // Store the new pin in the ref and call the parent's handler
          userPinRef.current = newPin;
          onLocationSelect(location);
        });
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            newMap.setCenter(userLocation);
            newMap.setZoom(15);
          },
          () => {
            console.error("Geolocation failed or was denied.");
          }
        );
      }
    }).catch(e => {
      console.error("Failed to load Google Maps API", e);
      setLoading(false);
    });
  }, [onLocationSelect]);

  useEffect(() => {
    if (!map || !reports) return;

    // Clear existing report markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const addMarkers = async () => {
      const { AdvancedMarkerElement } = await mapLoader.load().then(google => google.maps.importLibrary("marker"));

      reports.forEach(report => {
        if (report.latitude && report.longitude) {
          const pinElement = document.createElement('div');
          pinElement.className = 'w-6 h-6 rounded-full';
          pinElement.style.backgroundColor = getPinColor(report.severity);
          pinElement.style.border = '2px solid white';
          pinElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

          const marker = new AdvancedMarkerElement({
            position: { lat: report.latitude, lng: report.longitude },
            map,
            content: pinElement,
            title: report.incident_type,
          });

          marker.addListener('click', () => {
            if(onMarkerClick) onMarkerClick(report);
          });
          markersRef.current.push(marker);
        }
      });
    }

    if (!showHeatmap) {
      addMarkers();
      if(heatmapRef.current) heatmapRef.current.setData([]);
    } else {
      const heatmapData = reports.filter(r => r.latitude && r.longitude).map(report => ({
        location: new window.google.maps.LatLng(report.latitude, report.longitude),
        weight: 1,
      }));
      if(heatmapRef.current) heatmapRef.current.setData(heatmapData);
    }

  }, [map, reports, onMarkerClick, showHeatmap]);

  return (
    <div className="relative h-full w-full">
      {loading && <MapViewSkeleton />}
      <div ref={mapRef} className={`h-full w-full ${loading ? 'invisible' : ''}`} />
    </div>
  );
};

export default MapView;