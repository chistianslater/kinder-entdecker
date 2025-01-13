import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Activity } from '@/types/activity';
import { createMapMarkerElement } from './MapMarker';
import { createPopupContent } from './MapPopup';

interface ActivityMarkerProps {
  activity: Activity;
  map: mapboxgl.Map;
  onSelectActivity: (activity: Activity) => void;
}

const parseCoordinates = (coordinates: string | { x: number; y: number } | null) => {
  if (!coordinates) return null;
  
  if (typeof coordinates === 'string') {
    // Parse string format "(x,y)"
    const match = coordinates.match(/\(([-\d.]+),([-\d.]+)\)/);
    if (match) {
      return {
        x: parseFloat(match[1]),
        y: parseFloat(match[2])
      };
    }
    return null;
  }
  
  return coordinates;
};

export const addActivityMarker = ({
  activity,
  map,
  onSelectActivity,
}: ActivityMarkerProps) => {
  if (!activity.coordinates) return;
  
  const coords = parseCoordinates(activity.coordinates);
  if (!coords) {
    console.warn('Invalid coordinates format for activity:', activity);
    return;
  }
  
  const { x, y } = coords;
  
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
      onSelectActivity(activity);
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
    .addTo(map);
};