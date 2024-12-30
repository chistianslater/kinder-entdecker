import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async (token: string) => {
      try {
        // Ensure the component is still mounted
        if (!isMounted) return;

        // Ensure container exists
        if (!mapContainer.current) {
          throw new Error('Map container not found');
        }

        // Set access token
        mapboxgl.accessToken = token;

        // Create map instance
        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [10.4515, 51.1657], // Center on Germany
          zoom: 5.5,
          maxBounds: [
            [-5, 47], // Southwest coordinates
            [25, 56]  // Northeast coordinates
          ]
        });

        // Add navigation controls
        newMap.addControl(
          new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: false
          }), 
          'top-right'
        );

        // Handle successful map load
        newMap.on('load', () => {
          if (!isMounted) return;
          console.log('Map loaded successfully');
          setIsLoading(false);
          setError('');
        });

        // Handle map errors
        newMap.on('error', (e) => {
          if (!isMounted) return;
          console.error('Map error:', e);
          setError(`Map error: ${e.error.message}`);
          setIsLoading(false);
        });

        map.current = newMap;

      } catch (err) {
        if (!isMounted) return;
        console.error('Map initialization error:', err);
        setError('Map initialization failed. Please try again later.');
        setIsLoading(false);
      }
    };

    const fetchMapboxToken = async () => {
      try {
        if (!isMounted) return;
        
        console.log('Fetching Mapbox token...');
        const { data, error: supabaseError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (supabaseError) {
          console.error('Supabase function error:', supabaseError);
          throw supabaseError;
        }
        
        if (!data?.token) {
          console.error('No token received from function');
          throw new Error('No token received');
        }
        
        console.log('Token received successfully');
        
        // Add a small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!isMounted) return;
        await initializeMap(data.token);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching Mapbox token:', err);
        setError('Failed to load map. Please try again later.');
        setIsLoading(false);
      }
    };

    // Start the initialization process
    fetchMapboxToken();

    // Cleanup function
    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-4rem)] bg-gray-50 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)] bg-red-50 rounded-lg">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Map container
  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg shadow-md overflow-hidden"
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </div>
  );
};

export default Map;