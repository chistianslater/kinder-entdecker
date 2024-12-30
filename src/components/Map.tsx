import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Activity } from '@/types/activity';
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from 'lucide-react';

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
        
        // Initialize map centered on Germany with better zoom level
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
            
            // Create custom marker element with larger size and better visibility
            const markerEl = document.createElement('div');
            markerEl.className = 'w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer transform transition-transform hover:scale-110 shadow-lg border-3 border-white';
            markerEl.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

            // Create popup with more detailed information
            const popup = new mapboxgl.Popup({ 
              offset: 25, 
              closeButton: true,
              className: 'custom-popup'
            })
              .setHTML(`
                <div class="p-4">
                  <h3 class="font-bold text-xl mb-2">${activity.title}</h3>
                  <p class="text-sm text-gray-600 mb-2">${activity.type}</p>
                  ${activity.price_range ? `<p class="text-sm font-medium">Preis: ${activity.price_range}</p>` : ''}
                  ${activity.location ? `<p class="text-sm mt-2">${activity.location}</p>` : ''}
                </div>
              `);

            // Add marker to map with popup
            new mapboxgl.Marker({
              element: markerEl,
              anchor: 'bottom'
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