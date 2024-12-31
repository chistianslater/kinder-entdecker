import React, { useState, useEffect } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { useIsMobile } from '@/hooks/use-mobile';
import { PreferencesButton } from './filters/PreferencesButton';
import { FilterDialog } from './filters/FilterDialog';
import { Button } from './ui/button';
import { Filter } from 'lucide-react';
import { Badge } from './ui/badge';

export interface Filters {
  type?: string;
  ageRange?: string;
  activityType?: string;
  priceRange?: string;
  distance?: string;
  openingHours?: string;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface FilterBarProps {
  onFiltersChange: (filters: Filters) => void;
}

const FilterBar = ({ onFiltersChange }: FilterBarProps) => {
  const [filters, setFilters] = useState<Filters>({});
  const [isPreferencesActive, setIsPreferencesActive] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const { applyUserPreferences } = usePreferences({ 
    onFiltersChange, 
    setFilters 
  });

  useEffect(() => {
    if (filters.distance && filters.distance !== 'all' && !filters.userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newFilters = {
            ...filters,
            userLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          };
          setFilters(newFilters);
          onFiltersChange(newFilters);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [filters.distance]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    if (isPreferencesActive) {
      setIsPreferencesActive(false);
    }
    
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePreferencesClick = () => {
    if (isPreferencesActive) {
      setFilters({});
      onFiltersChange({});
      setIsPreferencesActive(false);
    } else {
      applyUserPreferences();
      setIsPreferencesActive(true);
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== undefined && value !== '').length;
  };

  return (
    <div className="bg-secondary/10 rounded-2xl p-4 mb-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <PreferencesButton 
          isActive={isPreferencesActive}
          onClick={handlePreferencesClick}
        />
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white hover:bg-secondary/80 border-accent transition-all duration-300 hover:scale-105"
          onClick={() => setShowFilterDialog(true)}
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {getActiveFiltersCount() > 0 && (
            <Badge 
              variant="default" 
              className="ml-2 animate-scale-in"
            >
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </div>

      <FilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default FilterBar;