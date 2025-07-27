import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import mapLoader from '../services/mapLoader';

const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // This callback creates the map instance and stores it in a ref.
  // It is designed to be called only once when the map container div is mounted.
  const initMap = useCallback((mapContainer) => {
    if (mapRef.current || !mapContainer) return;

    mapLoader.load().then(async (google) => {
      const { Map } = await google.maps.importLibrary("maps");
      const map = new Map(mapContainer, {
        center: { lat: 14.5995, lng: 120.9842 },
        zoom: 12,
        mapId: 'fe9a462b09a63dfca63c05a8',
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
      });
      mapRef.current = map;
      setIsLoaded(true);
    });
  }, []);

  const value = { map: mapRef.current, isLoaded, initMap };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};