import React from 'react';
import DetailView from '../DetailView';
import { Activity } from '@/types/activity';

interface MapContainerProps {
  mapRef: React.RefObject<HTMLDivElement>;
  selectedActivity: Activity | null;
  onCloseDetail: () => void;
}

export const MapContainer = ({ mapRef, selectedActivity, onCloseDetail }: MapContainerProps) => {
  return (
    <>
      <div className="w-full h-[calc(100vh-12rem)] rounded-xl overflow-hidden shadow-lg">
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