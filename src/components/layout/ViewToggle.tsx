import React from 'react';
import { Button } from "@/components/ui/button";
import { List, Map as MapIcon, Calendar } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'list' | 'map' | 'events';
  onViewChange: (mode: 'list' | 'map' | 'events') => void;
}

const ViewToggle = ({ viewMode, onViewChange }: ViewToggleProps) => {
  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-6 mb-6 shadow-glass">
      <div className="flex justify-end gap-2">
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          onClick={() => onViewChange('list')}
          className="flex items-center gap-2"
        >
          <List className="w-4 h-4" />
          Liste
        </Button>
        <Button
          variant={viewMode === 'map' ? 'default' : 'outline'}
          onClick={() => onViewChange('map')}
          className="flex items-center gap-2"
        >
          <MapIcon className="w-4 h-4" />
          Karte
        </Button>
        <Button
          variant={viewMode === 'events' ? 'default' : 'outline'}
          onClick={() => onViewChange('events')}
          className="flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Events
        </Button>
      </div>
    </div>
  );
};

export default ViewToggle;