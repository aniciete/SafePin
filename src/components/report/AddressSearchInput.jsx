import { useState, useEffect, useRef, useCallback } from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import MapView from '../map/MapView';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Crosshair } from 'lucide-react';
import { METRO_MANILA_BOUNDS } from '../../services/report/types';
import MapViewSkeleton from '../map/MapViewSkeleton';

const AddressSearchInput = ({ onLocationChange, markerPosition }) => {
  const { isApiLoaded, getJurisdiction, reverseGeocode } = useGoogleMaps();
  const [jurisdictionInfo, setJurisdictionInfo] = useState({ name: null, code: null });
  const [isGeolocating, setIsGeolocating] = useState(false);
  const inputRef = useRef(null);
  
  // This state controls when the MapView is actually mounted.
  const [isStable, setIsStable] = useState(false);
  useEffect(() => {
    // After the component has mounted and animated into place,
    // a short timeout ensures the DOM is stable. Then we set isStable to true.
    const timer = setTimeout(() => setIsStable(true), 350); // Matches animation duration
    return () => clearTimeout(timer);
  }, []);

  const updateLocation = useCallback(async (newLocation, newAddress = null) => {
    const jurisdiction = await getJurisdiction(newLocation);
    setJurisdictionInfo(jurisdiction);

    let finalAddress = newAddress;
    if (!finalAddress) {
      try {
        finalAddress = await reverseGeocode(newLocation);
      } catch (error) {
        console.error(error);
        finalAddress = `Lat: ${newLocation.lat.toFixed(6)}, Lng: ${newLocation.lng.toFixed(6)}`;
      }
    }
    
    if (inputRef.current) {
      inputRef.current.value = finalAddress;
    }

    const isLocationValid = !jurisdiction.name.toLowerCase().includes('outside');
    
    onLocationChange({
      lat: isLocationValid ? newLocation.lat : null,
      lng: isLocationValid ? newLocation.lng : null,
      jurisdiction: jurisdiction.code,
    });
  }, [getJurisdiction, reverseGeocode, onLocationChange]);

  const handleMapClick = useCallback((newLocation) => {
    updateLocation(newLocation);
  }, [updateLocation]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGeolocating(true);
      navigator.geolocation.getCurrentPosition((position) => {
        const newLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        updateLocation(newLocation);
        setIsGeolocating(false);
      }, (error) => {
        console.error("Geolocation error:", error);
        alert("Could not retrieve your location...");
        setIsGeolocating(false);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (isStable && isApiLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        bounds: METRO_MANILA_BOUNDS,
        componentRestrictions: { country: "ph" },
        fields: ["formatted_address", "geometry.location"],
      });

      const listener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const newLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          updateLocation(newLocation, place.formatted_address);
        }
      });

      return () => listener.remove();
    }
  }, [isStable, isApiLoaded, updateLocation]);

 return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="address-search">Search for an address or click on the map</Label>
        <Input ref={inputRef} id="address-search" type="text" placeholder="e.g., Ayala Avenue, Makati" />
      </div>
      <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-md" role="application">
        {/* Only render the MapView component AFTER the container is stable. */}
        {isStable ? (
          <MapView
            onLocationSelect={handleMapClick}
            markerPosition={markerPosition} 
          />
        ) : (
          <MapViewSkeleton />
        )}
        <Button type="button" size="icon" className="absolute top-2 right-2 z-10" onClick={handleGetCurrentLocation} disabled={isGeolocating} aria-label="Use current location">
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