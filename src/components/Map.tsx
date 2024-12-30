import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeMap = async (token: string) => {
      if (!mapContainer.current) return;
      
      try {
        console.log('Initializing map with token:', token ? 'Token exists' : 'No token');
        
        mapboxgl.accessToken = token;

        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [10.4515, 51.1657], // Center on Germany
          zoom: 5.5,
        });

        // Add navigation control
        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Handle map load
        newMap.on('load', () => {
          console.log('Map loaded successfully');
          setIsLoading(false);
        });

        // Handle map error
        newMap.on('error', (e) => {
          console.error('Map error:', e);
          setError('Error loading map: ' + e.error.message);
          setIsLoading(false);
        });

        map.current = newMap;
        setError('');
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Failed to initialize map. Please try again later.');
        setIsLoading(false);
      }
    };

    const fetchMapboxToken = async () => {
      try {
        console.log('Fetching Mapbox token...');
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
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
        setIsLoading(false);
      }
    };

    fetchMapboxToken();

    return () => {
      if (map.current) {
        map.current.remove();
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
        className="absolute inset-0 rounded-lg shadow-md"
      />
    </div>
  );
};

export default Map;