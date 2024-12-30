import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Function to initialize the map
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        // Set the access token
        const token = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHRpYnB5Y2QwMWJqMmtvOW1qZjB0aTd0In0.O8lasM04g-C8wzTz8_IQSQ';
        setMapboxToken(token);
        mapboxgl.accessToken = token;

        // Create map instance
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [10.4515, 51.1657], // Center on Germany
          zoom: 5,
          attributionControl: true,
        });

        // Add navigation control
        const navControl = new mapboxgl.NavigationControl({
          visualizePitch: true
        });
        mapInstance.addControl(navControl, 'top-right');

        // Handle map load
        mapInstance.on('load', () => {
          mapInstance.resize();
        });

        // Error handling
        mapInstance.on('error', (e) => {
          console.error('Mapbox error:', e);
          setError('Error loading map. Please try again later.');
        });

        // Cleanup function
        return () => {
          mapInstance.remove();
        };
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Failed to initialize map. Please try again later.');
      }
    };

    // Initialize the map
    const cleanup = initializeMap();

    // Cleanup on unmount
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, []); // Empty dependency array ensures the map is only initialized once

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)] bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg shadow-soft"
      />
      {!mapboxToken && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-600">Loading map...</p>
        </div>
      )}
    </div>
  );
};

export default Map;