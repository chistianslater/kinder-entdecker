import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Activity } from '@/types/activity';
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from 'lucide-react';
import ReactDOM from 'react-dom';

interface MapProps {
  activities: Activity[];
}

const Map = ({ activities }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        // Fetch Mapbox token from Edge Function
        const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) throw error;
        
        mapboxgl.accessToken = token;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [10.4515, 51.1657], // Center of Germany
          zoom: 5.5
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add markers for activities
        activities.forEach(activity => {
          if (activity.coordinates) {
            const coords = activity.coordinates as unknown as { x: number; y: number };
            
            // Create marker element
            const markerEl = document.createElement('div');
            markerEl.className = 'marker-pin';
            
            // Create a React component for the marker
            const MarkerComponent = () => (
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform shadow-xl border-4 border-white">
                <MapPin size={40} color="white" strokeWidth={3} />
              </div>
            );

            // Render React component into marker element
            ReactDOM.render(<MarkerComponent />, markerEl);

            // Create popup with enhanced styling
            const popup = new mapboxgl.Popup({ 
              offset: 35,
              closeButton: true,
              className: 'custom-popup',
              maxWidth: '300px'
            })
              .setHTML(`
                <div class="p-6">
                  <h3 class="font-bold text-2xl mb-3">${activity.title}</h3>
                  <p class="text-base text-gray-600 mb-3">${activity.type}</p>
                  ${activity.price_range ? `<p class="text-base font-medium mb-2">Preis: ${activity.price_range}</p>` : ''}
                  ${activity.location ? `<p class="text-base mt-2">${activity.location}</p>` : ''}
                </div>
              `);

            // Add marker to map with popup
            new mapboxgl.Marker({
              element: markerEl,
              anchor: 'bottom',
              scale: 1.2
            })
              .setLngLat([coords.x, coords.y])
              .setPopup(popup)
              .addTo(map.current);
          }
        });

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [activities]);

  return (
    <div className="w-full h-[calc(100vh-12rem)] rounded-xl overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;