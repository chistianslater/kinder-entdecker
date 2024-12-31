import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Activity } from '@/types/activity';
import { supabase } from "@/integrations/supabase/client";
import { createMapMarkerElement } from './map/MapMarker';
import { createPopupContent } from './map/MapPopup';
import { MapContainer } from './map/MapContainer';

interface MapProps {
  activities: Activity[];
}

const Map = ({ activities }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        
        mapboxgl.accessToken = token;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [10.4515, 51.1657],
          zoom: 5.5
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        activities.forEach((activity) => {
          if (activity.coordinates) {
            const { x, y } = activity.coordinates;
            
            if (isNaN(x) || isNaN(y)) {
              console.warn('Invalid coordinates values for activity:', activity);
              return;
            }

            const markerEl = createMapMarkerElement();

            const popup = new mapboxgl.Popup({ 
              offset: 25,
              closeButton: true,
              className: 'custom-popup',
              maxWidth: '300px'
            }).setDOMContent(createPopupContent({
              activity,
              onNavigate: () => {
                const encodedAddress = encodeURIComponent(activity.location);
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank', 'noopener,noreferrer');
              },
              onViewDetails: () => {
                setSelectedActivity(activity);
                popup.remove();
              }
            }));

            new mapboxgl.Marker({
              element: markerEl,
              anchor: 'bottom',
              scale: 1
            })
              .setLngLat([x, y])
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
    <MapContainer 
      mapRef={mapContainer}
      selectedActivity={selectedActivity}
      onCloseDetail={() => setSelectedActivity(null)}
    />
  );
};

export default Map;