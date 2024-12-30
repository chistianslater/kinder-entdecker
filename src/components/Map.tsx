import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

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
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        console.log('Fetching Mapbox token...');
        const { data, error } = await supabase.functions.invoke('get-mapbox-token', {
          method: 'GET'
        });
        
        if (error) {
          console.error('Supabase function error:', error);
          throw error;
        }
        
        if (!data?.token) {
          console.error('No token received from function');
          throw new Error('No token received');
        }
        
        console.log('Token received successfully');
        await initializeMap(data.token);
      } catch (err) {
        console.error('Error fetching Mapbox token:', err);
        setError('Error loading map. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapboxToken();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)] bg-gray-50 rounded-lg">
        <p>Loading map...</p>
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