import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { toast } = useToast();

  const initializeMap = () => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [10.4515, 51.1657], // Zentrum von Deutschland
        zoom: 5,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      setIsMapInitialized(true);
      toast({
        title: "Karte erfolgreich initialisiert",
        description: "Die Mapbox-Karte wurde erfolgreich geladen.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Laden der Karte",
        description: "Bitte überprüfen Sie Ihren Mapbox-Token.",
      });
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="space-y-4">
      {!isMapInitialized && (
        <div className="bg-white p-4 rounded-lg shadow-soft">
          <h3 className="text-lg font-medium mb-2">Mapbox-Token eingeben</h3>
          <p className="text-sm text-gray-600 mb-4">
            Bitte geben Sie Ihren Mapbox-Token ein, um die Karte zu aktivieren. 
            Sie können einen Token auf <a href="https://www.mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a> erstellen.
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="pk.eyJ1..."
              className="flex-1"
            />
            <Button onClick={initializeMap}>Karte laden</Button>
          </div>
        </div>
      )}
      <div className={`relative w-full ${isMapInitialized ? 'h-[calc(100vh-4rem)]' : 'h-0'}`}>
        <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-soft" />
      </div>
    </div>
  );
};

export default Map;