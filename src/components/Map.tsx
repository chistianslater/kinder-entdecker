import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Activity } from '@/types/activity';
import { MapContainer } from './map/MapContainer';
import { initializeMap } from './map/MapInitializer';
import { addActivityMarker } from './map/ActivityMarker';

interface MapProps {
  activities: Activity[];
}

const Map = ({ activities }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const setupMap = async () => {
      if (!mapContainer.current) return;

      try {
        map.current = await initializeMap(mapContainer.current);

        // Add markers for each activity
        activities.forEach((activity) => {
          addActivityMarker({
            activity,
            map: map.current!,
            onSelectActivity: setSelectedActivity,
          });
        });
      } catch (error) {
        console.error('Error setting up map:', error);
      }
    };

    setupMap();

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