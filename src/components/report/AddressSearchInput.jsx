import { useState, useEffect, useRef, useCallback } from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { isWithinMetroManila } from '../../utils/geofence';
import { useMap } from '../../contexts/MapContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Crosshair } from 'lucide-react';
import MapViewSkeleton from '../map/MapViewSkeleton';
import { createRoot } from 'react-dom/client';
import MapMarker from '../map/MapMarker';

const AddressSearchInput = ({ onLocationChange }) => {
  const { isApiLoaded, getJurisdiction, reverseGeocode } = useGoogleMaps();
  // --- THIS IS THE FIX (Part 1): Get the new setMapContainer function from the context ---
  const { map, isLoaded, setMapContainer } = useMap();
  
  const [jurisdictionInfo, setJurisdictionInfo] = useState({ name: null, code: null });
  const [isGeolocating, setIsGeolocating] = useState(false);
  const inputRef = useRef(null);
  const markerRef = useRef(null);
  const markerRootRef = useRef(null);

  const updateLocation = useCallback(async (newLocation, newAddress = null) => {
    if (!newLocation || !newLocation.lat || !newLocation.lng || !map) return;

    if (!isWithinMetroManila(newLocation)) {
      alert('The selected location is outside Metro Manila. Please choose a location within the NCR.');
      return;
    }
    
    map.panTo(newLocation);
    if (map.getZoom() < 14) {
      map.setZoom(16);
    }
    
    if (markerRef.current) {
      markerRef.current.position = newLocation;
    } else {
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      const container = document.createElement('div');
      markerRootRef.current = createRoot(container);
      markerRef.current = new AdvancedMarkerElement({
        position: newLocation,
        map,
        content: container,
      });
    }

    if (markerRootRef.current) {
      markerRootRef.current.render(<MapMarker severity="critical" status="pending_verification" />);
    }
    
    const jurisdiction = await getJurisdiction(newLocation);
    setJurisdictionInfo(jurisdiction);

    let finalAddress = newAddress;
    if (finalAddress === null) {
      try {
        finalAddress = await reverseGeocode(newLocation);
      } catch (error) {
        console.error("Reverse geocode failed:", error);
        finalAddress = `Lat: ${newLocation.lat.toFixed(6)}, Lng: ${newLocation.lng.toFixed(6)}`;
      }
    }
    
    if (inputRef.current) inputRef.current.value = finalAddress;

    onLocationChange({
      lat: newLocation.lat,
      lng: newLocation.lng,
      jurisdiction: jurisdiction.code,
    });
  }, [map, getJurisdiction, reverseGeocode, onLocationChange]);

  useEffect(() => {
    if (map) {
      const listener = map.addListener('click', (e) => {
        updateLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      });
      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [map, updateLocation]);
  
  useEffect(() => {
    if (isApiLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "ph" },
        fields: ["formatted_address", "geometry.location"],
      });
      const listener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          updateLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }, place.formatted_address);
        }
      });
      return () => window.google.maps.event.removeListener(listener);
    }
  }, [isApiLoaded, updateLocation]);

  const handleGetCurrentLocation = () => {
    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition((position) => {
      updateLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      setIsGeolocating(false);
    }, () => { alert("Could not retrieve your location."); setIsGeolocating(false); });
  };

 return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="address-search">Search for an address or click on the map</Label>
        <Input ref={inputRef} id="address-search" type="text" placeholder="e.g., Ayala Avenue, Makati" />
      </div>
      <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-md" role="application">
        {/* --- THIS IS THE FIX (Part 2): Use the `setMapContainer` function as the ref --- */}
        {/* This tells the context about the div every time it mounts. */}
        <div ref={setMapContainer} className="h-full w-full" />
        {!isLoaded && <MapViewSkeleton />}
        <Button type="button" size="icon" className="absolute top-2 right-2 z-10" onClick={handleGetCurrentLocation} disabled={isGeolocating}>
          <Crosshair className={`h-5 w-5 ${isGeolocating ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
      {jurisdictionInfo.name && (
        <div className="mt-2 text-center p-2 rounded-md bg-primary text-primary-foreground">
          <p className="text-sm font-medium">Assigned Barangay: <span className="font-bold">{jurisdictionInfo.name}</span></p>
        </div>
      )}
    </div>
  );
};

export default AddressSearchInput;