import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Initialize map only if it hasn't been created yet
    try {
      mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHRpYnB5Y2QwMWJqMmtvOW1qZjB0aTd0In0.O8lasM04g-C8wzTz8_IQSQ';
      
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [10.4515, 51.1657], // Center of Germany
        zoom: 5,
      });

      // Add navigation control after map is loaded
      map.on('load', () => {
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      });
      
      mapInstance.current = map;
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup function
    return () => {
      try {
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      } catch (error) {
        console.error('Error cleaning up map:', error);
      }
    };
  }, []); // Empty dependency array since we only want to initialize once

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-soft" />
    </div>
  );
};

export default Map;