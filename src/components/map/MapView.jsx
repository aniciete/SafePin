import { useEffect, useRef } from 'react';
import mapLoader from '../../services/mapLoader';

const MapView = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    mapLoader.load().then(async (google) => {
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      const map = new Map(mapRef.current, {
    center: { lat: 12.8797, lng: 121.774 },
    zoom: 6,
    mapId: 'SAFE_PIN_MAP'
  });

  map.addListener('click', (e) => {
    if (markerRef.current) {
      markerRef.current.map = null;
    }
    markerRef.current = new AdvancedMarkerElement({
      position: e.latLng,
      map,
    });
    onLocationSelect(e.latLng.toJSON());
  });
}).catch(e => {
  console.error("Failed to load Google Maps API", e);
});
  }, [onLocationSelect]);

  return <div ref={mapRef} style={{ height: '400px' }} />;
};

export default MapView;