import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import mapLoader from '../../services/mapLoader';
import MapViewSkeleton from './MapViewSkeleton';
import MapMarker from './MapMarker';
import { MarkerClusterer } from '../../utils/marker-clusterer';

const MapView = ({ reports, onMarkerClick, onLocationSelect, markerPosition }) => {
  const mapRef = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const reportMarkersRef = useRef([]);
  const markerElementsRef = useRef({});
  const userPinRef = useRef(null);
  const clustererInitializedRef = useRef(false);

  const initMap = useCallback(() => {
    mapLoader.load().then(async (google) => {
      const { Map } = await google.maps.importLibrary("maps");
      const map = new Map(mapRef.current, {
        center: markerPosition || { lat: 14.5995, lng: 120.9842 },
        zoom: markerPosition ? 17 : 12,
        mapId: 'SAFE_PIN_MAP',
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
      });
      setGoogleMap(map);
      setLoading(false);

      if (onLocationSelect) {
        map.addListener('click', (e) => {
          onLocationSelect({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        });
      }
      
      // Initialize marker clusterer if we have many reports
      if (reports && reports.length > 10) {
        try {
          await MarkerClusterer.initialize(map);
          clustererInitializedRef.current = true;
        } catch (error) {
          console.error('Failed to initialize marker clusterer:', error);
        }
      }
    });
  }, [markerPosition, onLocationSelect, reports]);

  useEffect(() => {
    if (!mapRef.current) return;
    initMap();
    
    return () => {
      // Clean up clusterer on unmount
      if (clustererInitializedRef.current) {
        MarkerClusterer.clearMarkers();
      }
    };
  }, [initMap]);

  // Effect to manage the single user-placed pin
  useEffect(() => {
    if (!googleMap) return;
    if (markerPosition && markerPosition.lat && markerPosition.lng) {
      mapLoader.load().then(async () => {
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
        
        // Create a container for our custom marker
        const container = document.createElement('div');
        container.className = 'user-pin-container';
        
        // Render our marker into this container
        const userMarkerPortal = createPortal(
          <MapMarker
            severity="Low"
            pulse={true}
            title="Selected Location"
          />,
          container
        );
        
        // Store the portal reference to prevent it from being garbage collected
        container._portalInstance = userMarkerPortal;
        
        if (userPinRef.current) {
          userPinRef.current.position = markerPosition;
        } else {
          userPinRef.current = new AdvancedMarkerElement({
            position: markerPosition,
            map: googleMap,
            content: container,
            title: 'Selected Location',
          });
          
          // Add drop animation class
          container.classList.add('animate-marker-drop');
          // Remove animation class after it completes
          setTimeout(() => {
            container.classList.remove('animate-marker-drop');
          }, 500);
        }
        
        googleMap.panTo(markerPosition);
      });
    } else {
      if (userPinRef.current) {
        userPinRef.current.map = null;
        userPinRef.current = null;
      }
    }
  }, [googleMap, markerPosition]);

  // Handle marker click with animation
  const handleMarkerClick = useCallback((report) => {
    setSelectedReportId(report.id);
    if (onMarkerClick) {
      onMarkerClick(report);
    }
  }, [onMarkerClick]);

  // Effect to manage the multiple report markers for dashboards
  useEffect(() => {
    if (!googleMap || !reports) return;
    
    // Clear existing report markers
    reportMarkersRef.current.forEach(marker => marker.map = null);
    reportMarkersRef.current = [];
    markerElementsRef.current = {};

    // Clear clusterer if initialized
    if (clustererInitializedRef.current) {
      MarkerClusterer.clearMarkers();
    }

    mapLoader.load().then(async () => {
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
      const markers = [];
      
      reports.forEach((report, index) => {
        if (report.location?.lat && report.location?.lng) {
          // Create a container for our custom marker
          const container = document.createElement('div');
          container.className = 'report-marker-container';
          
          // Add staggered animation class
          container.classList.add('marker-stagger-appear', 'animate-marker-drop');
          // Remove animation class after it completes
          setTimeout(() => {
            container.classList.remove('animate-marker-drop');
          }, 500 + (index * 50)); // Staggered removal
          
          // Render our marker into this container
          const markerPortal = createPortal(
            <MapMarker
              isSelected={report.id === selectedReportId}
              severity={report.severity}
              title={report.incident_type}
              onClick={() => handleMarkerClick(report)}
            />,
            container
          );
          
          // Store the portal reference to prevent it from being garbage collected
          container._portalInstance = markerPortal;
          
          const marker = new AdvancedMarkerElement({
            position: report.location,
            map: googleMap,
            content: container,
            title: report.incident_type,
          });
          
          // Store references for later updates
          reportMarkersRef.current.push(marker);
          markerElementsRef.current[report.id] = container;
          markers.push(marker);
        }
      });
      
      // Add markers to clusterer if initialized and we have enough markers
      if (clustererInitializedRef.current && markers.length > 10) {
        MarkerClusterer.addMarkers(markers);
      }
    });
  }, [googleMap, reports, selectedReportId, handleMarkerClick]);

  return (
    <div className="relative h-full w-full">
      {loading && <MapViewSkeleton />}
      <div ref={mapRef} className={`h-full w-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  );
};

export default MapView;