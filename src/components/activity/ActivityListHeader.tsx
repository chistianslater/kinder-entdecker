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
    <div className="sticky top-[85px] z-20 pt-4 pb-2 -mx-4 px-4 transition-colors duration-200 bg-background">
      <div className="absolute inset-0 group-[.is-sticky]:bg-secondary group-[.is-sticky]:backdrop-blur-sm group-[.is-sticky]:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.3)] group-[.is-sticky]:pt-6" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <FilterBar onFiltersChange={onFiltersChange} />
          <Button 
            onClick={onCreateClick}
            className="ml-4 rounded-2xl transition-all duration-300 hover:scale-105"
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