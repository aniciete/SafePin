import { useEffect, useRef, useState } from 'react';
import mapLoader from '../../services/mapLoader';
import MapViewSkeleton from './MapViewSkeleton';

const getPinColor = (severity) => {
  switch (severity) {
    case 'Critical':
      return '#FF0000'; // Red
    case 'High':
      return '#FFA500'; // Orange
    case 'Medium':
      return '#FFFF00'; // Yellow
    case 'Low':
      return '#0000FF'; // Blue
    default:
      return '#808080'; // Gray
  }
};

const MapView = ({ reports, onMarkerClick, showHeatmap = false }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const markersRef = useRef([]);
  const heatmapRef = useRef(null);

  useEffect(() => {
    mapLoader.load().then(async (google) => {
      const { Map } = await google.maps.importLibrary("maps");
      const { HeatmapLayer } = await google.maps.importLibrary("visualization");
      
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
  }, []);

  useEffect(() => {
    if (!map || !reports) return;

    // Clear existing markers
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
            onMarkerClick(report);
          });
          markersRef.current.push(marker);
        }
      });
    }

    if (!showHeatmap) {
      addMarkers();
      heatmapRef.current.setData([]);
    } else {
      const heatmapData = reports.map(report => ({
        location: new google.maps.LatLng(report.latitude, report.longitude),
        weight: 1,
      }));
      heatmapRef.current.setData(heatmapData);
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