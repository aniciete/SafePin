import { useState, useEffect, useCallback } from 'react';
import mapLoader from '../services/mapLoader';
import { useSupabase } from '../contexts/SupabaseContext';
import jurisdictions from '../utils/jurisdictions.json';
import { METRO_MANILA_BOUNDS } from '../services/report/types';

const isWithinMetroManila = (location) => {
  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return false;
  }
  const { north, south, east, west } = METRO_MANILA_BOUNDS;
  return (
    location.lat >= south &&
    location.lat <= north &&
    location.lng >= west &&
    location.lng <= east
  );
};

export const useGoogleMaps = () => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [geocoder, setGeocoder] = useState(null);
  const { supabase } = useSupabase();

  useEffect(() => {
    mapLoader.load().then(google => {
      setGeocoder(new google.maps.Geocoder());
      setIsApiLoaded(true);
    }).catch(error => {
      console.error("Failed to load Google Maps API", error);
    });
  }, []);

  const getJurisdiction = useCallback(async (location) => {
    if (!isWithinMetroManila(location)) {
      return { name: 'Location is outside of Metro Manila.', code: null };
    }

    try {
      const { data: psgc, error } = await supabase.rpc('get_jurisdiction_for_location', {
        lat: location.lat,
        lng: location.lng,
      });

      if (error) {
        console.error("Jurisdiction RPC error:", error);
        return { name: 'Metro Manila (Unassigned Barangay)', code: null };
      }

      if (psgc) {
        const match = jurisdictions.find(j => j.psgc_code === psgc);
        return {
          name: match ? `${match.barangay}, ${match.city}` : 'Metro Manila (Jurisdiction Found)',
          code: psgc,
        };
      }
      return { name: 'Metro Manila (Unassigned Barangay)', code: null };
    } catch (error) {
      console.error("Jurisdiction lookup failed:", error);
      return { name: 'Metro Manila (Error checking jurisdiction)', code: null };
    }
  }, [supabase]);

  const reverseGeocode = useCallback(async (location) => {
    if (!geocoder) return null;

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          console.error('Reverse geocode failed:', status);
          reject(new Error('Failed to find a human-readable address for the location.'));
        }
      });
    });
  }, [geocoder]);

  return { isApiLoaded, getJurisdiction, reverseGeocode };
};