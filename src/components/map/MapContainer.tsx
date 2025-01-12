import React, { useEffect, useRef } from 'react';
import DetailView from '../DetailView';
import { Activity } from '@/types/activity';

interface MapContainerProps {
  mapRef: React.RefObject<HTMLDivElement>;
  selectedActivity: Activity | null;
  onCloseDetail: () => void;
}

export const MapContainer = ({ mapRef, selectedActivity, onCloseDetail }: MapContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      // Debounce the resize handler
      const timeout = setTimeout(() => {
        for (const entry of entries) {
          if (entry.target === containerRef.current) {
            // Trigger map resize if needed
            if (mapRef.current) {
              window.dispatchEvent(new Event('resize'));
            }
          }
        }
      }, 100);

      return () => clearTimeout(timeout);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [mapRef]);

  return (
    <>
      <div ref={containerRef} className="w-full h-[calc(100vh-12rem)] rounded-xl overflow-hidden shadow-lg">
        <div ref={mapRef} className="w-full h-full" />
      </div>
      <DetailView 
        activity={selectedActivity}
        isOpen={selectedActivity !== null}
        onClose={onCloseDetail}
      />
    </>
  );
};