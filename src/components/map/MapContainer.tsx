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
  const requestAnimationFrameRef = useRef<number>();

  useEffect(() => {
    let isSubscribed = true;

    const handleResize = () => {
      if (!isSubscribed || !mapRef.current) return;
      
      // Use requestAnimationFrame to ensure smooth handling of resize events
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }

      requestAnimationFrameRef.current = requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
    };

    const resizeObserver = new ResizeObserver((entries) => {
      // Clear any existing timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Debounce resize events
      resizeTimeoutRef.current = setTimeout(() => {
        if (!isSubscribed) return;
        handleResize();
      }, 100);
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
      
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
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