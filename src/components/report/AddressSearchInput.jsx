import { useState, useEffect, useRef, useCallback } from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import MapView from '../map/MapView';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Crosshair } from 'lucide-react';
import { METRO_MANILA_BOUNDS } from '../../services/report/types';

const AddressSearchInput = ({ onLocationChange }) => {
  const { isApiLoaded, getJurisdiction, reverseGeocode } = useGoogleMaps();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [jurisdictionInfo, setJurisdictionInfo] = useState({ name: null, code: null });
  const [address, setAddress] = useState('');
  const [isGeolocating, setIsGeolocating] = useState(false);
  const inputRef = useRef(null);

  const updateLocation = useCallback(async (newLocation, newAddress = null) => {
    setLocation(newLocation);
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
    setAddress(finalAddress);

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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          updateLocation(newLocation);
          setIsGeolocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Could not retrieve your location. Please ensure you have enabled location services for your browser.");
          setIsGeolocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (isApiLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'ph' },
        fields: ['formatted_address', 'geometry'],
        bounds: new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(METRO_MANILA_BOUNDS.south, METRO_MANILA_BOUNDS.west),
            new window.google.maps.LatLng(METRO_MANILA_BOUNDS.north, METRO_MANILA_BOUNDS.east)
        ),
        strictBounds: false,
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const newLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          updateLocation(newLocation, place.formatted_address);
        }
      });
    }
  }, [isApiLoaded, updateLocation]);

  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="address-search">Search for an address or click on the map</Label>
        <Input
          id="address-search"
          ref={inputRef}
          type="text"
          placeholder="e.g., Ayala Avenue, Makati"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={!isApiLoaded}
        />
      </div>

      <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-md" role="application">
        <MapView
          onLocationSelect={handleMapClick}
          markerPosition={location.lat && location.lng ? location : null}
        />
        <Button
          type="button"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={handleGetCurrentLocation}
          disabled={isGeolocating}
          aria-label="Use current location"
        >
          <Crosshair className={`h-5 w-5 ${isGeolocating ? 'animate-pulse' : ''}`} />
        </Button>
      </div>

      {jurisdictionInfo.name && (
        <div className="mt-2 text-center p-2 rounded-md bg-primary text-primary-foreground">
          <p className="text-sm font-medium">
            Assigned Barangay: <span className="font-bold">{jurisdictionInfo.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressSearchInput;