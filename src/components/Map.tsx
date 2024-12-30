import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => 
    localStorage.getItem('mapbox_token') || ''
  );
  const [tempToken, setTempToken] = useState<string>('');
  const [error, setError] = useState<string>('');

  const initializeMap = async (token: string) => {
    if (!mapContainer.current) return;
    
    try {
      // Set the access token
      mapboxgl.accessToken = token;

      // Create map instance
      mapInstance.current = new mapboxgl.Map({
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
      mapInstance.current.addControl(navControl, 'top-right');

      // Handle map load
      mapInstance.current.once('load', () => {
        mapInstance.current?.resize();
      });

      setError('');
      localStorage.setItem('mapbox_token', token);
      setMapboxToken(token);
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map. Please check your Mapbox token.');
      localStorage.removeItem('mapbox_token');
      setMapboxToken('');
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempToken) {
      initializeMap(tempToken);
    }
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap(mapboxToken);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []); // Only run on mount

  if (!mapboxToken) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-4rem)] bg-gray-50 rounded-lg p-4 space-y-4">
        <Alert>
          <AlertDescription>
            Please enter your Mapbox public token to view the map. You can find your token in the 
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline mx-1"
            >
              Mapbox account dashboard
            </a>
          </AlertDescription>
        </Alert>
        <form onSubmit={handleTokenSubmit} className="flex flex-col space-y-2 w-full max-w-md">
          <Input
            type="text"
            value={tempToken}
            onChange={(e) => setTempToken(e.target.value)}
            placeholder="Enter your Mapbox token"
            className="w-full"
          />
          <Button type="submit" disabled={!tempToken}>
            Load Map
          </Button>
        </form>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)] bg-red-50 rounded-lg">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg shadow-soft"
      />
    </div>
  );
};

export default Map;