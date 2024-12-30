import React from 'react';
import { MapPin } from 'lucide-react';
import { createRoot } from 'react-dom/client';

interface MapMarkerProps {
  className?: string;
}

export const MapMarker = ({ className }: MapMarkerProps) => {
  return (
    <div className={`w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform shadow-md border-2 border-white ${className}`}>
      <MapPin size={12} color="white" />
    </div>
  );
};

export const createMapMarkerElement = () => {
  const markerEl = document.createElement('div');
  markerEl.className = 'marker-pin';
  const root = createRoot(markerEl);
  root.render(<MapMarker />);
  return markerEl;
};