// --- THIS IS THE FIX: Add `useEffect` to the import statement ---
import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import mapLoader from '../services/mapLoader';

const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [mapContainer, setMapContainer] = useState(null);

  const initMap = useCallback(() => {
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
  }, [mapContainer]);

  useEffect(() => {
    if (mapContainer) {
      if (!mapRef.current) {
        initMap();
      } else {
        // This is the official Google Maps API method to re-attach a map to a new div.
        mapContainer.appendChild(mapRef.current.getDiv());
      }
    }
  }, [mapContainer, initMap]);

  const value = { map: mapRef.current, isLoaded, setMapContainer };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};