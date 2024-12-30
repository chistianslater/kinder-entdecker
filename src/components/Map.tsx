import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Activity } from '@/types/activity';
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import DetailView from './DetailView';

interface MapProps {
  activities: Activity[];
}

const Map = ({ activities }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      console.log('Initializing map with activities:', activities);
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
        activities.forEach((activity) => {
          console.log(`Processing activity:`, activity);
          
          if (activity.coordinates && typeof activity.coordinates === 'string') {
            // Parse coordinates from string format "(longitude,latitude)"
            const coordsMatch = activity.coordinates.match(/\(([-\d.]+),([-\d.]+)\)/);
            
            if (!coordsMatch) {
              console.warn('Invalid coordinates format for activity:', activity);
              return;
            }

            const longitude = parseFloat(coordsMatch[1]);
            const latitude = parseFloat(coordsMatch[2]);

            if (isNaN(longitude) || isNaN(latitude)) {
              console.warn('Invalid coordinates values for activity:', activity);
              return;
            }

            console.log(`Creating marker for activity ${activity.title} at:`, longitude, latitude);

            // Create marker element
            const markerEl = document.createElement('div');
            markerEl.className = 'marker-pin';
            
            // Create a React component for the marker
            const MarkerComponent = () => (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform shadow-md border-2 border-white">
                <MapPin size={12} color="white" />
              </div>
            );

            // Create root for React component
            const root = createRoot(markerEl);
            root.render(<MarkerComponent />);

            // Create popup content
            const popupContent = document.createElement('div');
            popupContent.className = 'p-4';
            
            // Create buttons container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'flex gap-2 mt-3';

            // Create navigation button
            const navigationBtn = document.createElement('button');
            navigationBtn.className = 'navigation-btn flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground rounded-md text-sm hover:bg-accent/80 transition-colors';
            navigationBtn.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Navigation
            `;

            // Create details button
            const detailsBtn = document.createElement('button');
            detailsBtn.className = 'details-btn flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/80 transition-colors';
            detailsBtn.innerHTML = `
              Details
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            `;

            // Add buttons to container
            buttonsContainer.appendChild(navigationBtn);
            buttonsContainer.appendChild(detailsBtn);

            // Set popup content
            popupContent.innerHTML = `
              <h3 class="font-bold text-lg mb-2">${activity.title}</h3>
              <p class="text-sm text-gray-600 mb-2">${activity.type}</p>
              ${activity.price_range ? `<p class="text-sm mb-1">Preis: ${activity.price_range}</p>` : ''}
            `;
            popupContent.appendChild(buttonsContainer);

            // Create popup
            const popup = new mapboxgl.Popup({ 
              offset: 25,
              closeButton: true,
              className: 'custom-popup',
              maxWidth: '300px'
            }).setDOMContent(popupContent);

            // Add event listeners
            navigationBtn.addEventListener('click', (e) => {
              console.log('Navigation button clicked');
              e.stopPropagation();
              const encodedAddress = encodeURIComponent(activity.location);
              window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank', 'noopener,noreferrer');
            });

            detailsBtn.addEventListener('click', (e) => {
              console.log('Details button clicked for activity:', activity.title);
              e.stopPropagation();
              setSelectedActivity(activity);
              popup.remove(); // Close the popup after selecting
            });

            // Add marker to map with popup
            new mapboxgl.Marker({
              element: markerEl,
              anchor: 'bottom',
              scale: 1
            })
              .setLngLat([longitude, latitude])
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
    <>
      <div className="w-full h-[calc(100vh-12rem)] rounded-xl overflow-hidden shadow-lg">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
      <DetailView 
        activity={selectedActivity}
        isOpen={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
      />
    </>
  );
};

export default Map;