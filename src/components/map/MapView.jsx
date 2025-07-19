import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const MapView = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });
loader.load().then(async (google) => {
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