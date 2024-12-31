import React, { useState, useEffect } from 'react';
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { usePreferences } from '@/hooks/usePreferences';
import { useIsMobile } from '@/hooks/use-mobile';
import { PreferencesButton } from './filters/PreferencesButton';
import { MobileFilterButton } from './filters/MobileFilterButton';
import { DesktopFilters } from './filters/DesktopFilters';
import { MobileFilterDrawer } from './filters/MobileFilterDrawer';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { applyUserPreferences } = usePreferences({ 
    onFiltersChange, 
    setFilters 
  });
  const isMobile = useIsMobile();

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
    <div className="bg-white shadow-soft rounded-2xl p-4 mb-6">
      <div className="flex flex-wrap gap-2 items-start justify-start">
        <div className="flex-shrink-0">
          <PreferencesButton 
            isActive={isPreferencesActive}
            onClick={handlePreferencesClick}
          />
        </div>

        {isMobile ? (
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <div onClick={() => setIsDrawerOpen(true)}>
                <MobileFilterButton activeFiltersCount={getActiveFiltersCount()} />
              </div>
            </DrawerTrigger>
            <MobileFilterDrawer 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setIsDrawerOpen(false)}
            />
          </Drawer>
        ) : (
          <DesktopFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>
    </div>
  );
};

export default FilterBar;