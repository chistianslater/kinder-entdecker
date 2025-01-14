import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import FilterBar from '../FilterBar';
import { Filters } from '../FilterBar';

interface ActivityListHeaderProps {
  onFiltersChange: (filters: Filters) => void;
  onCreateClick: () => void;
}

const ActivityListHeader = ({ 
  onFiltersChange, 
  onCreateClick 
}: ActivityListHeaderProps) => {
  return (
    <div className="group sticky top-0 z-20 pt-4 pb-2 -mx-4 px-4 border-b transition-colors duration-200">
      <div className="absolute inset-0 group-[.is-sticky]:bg-secondary group-[.is-sticky]:backdrop-blur-sm" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <FilterBar onFiltersChange={onFiltersChange} />
          <Button 
            onClick={onCreateClick}
            className="ml-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Aktivität erstellen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivityListHeader;