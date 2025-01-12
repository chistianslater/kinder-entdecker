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
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let isSubscribed = true;
    const resizeObserver = new ResizeObserver((entries) => {
      // Clear any existing timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Set a new timeout to handle the resize event
      resizeTimeoutRef.current = setTimeout(() => {
        if (!isSubscribed) return;

        for (const entry of entries) {
          if (entry.target === containerRef.current && mapRef.current) {
            // Dispatch resize event only if the component is still mounted
            window.dispatchEvent(new Event('resize'));
          }
        }
      }, 250); // Debounce resize events with a 250ms delay
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup function
    return () => {
      isSubscribed = false;
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
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