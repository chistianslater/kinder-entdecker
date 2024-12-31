import React, { useState, useEffect } from 'react';
import { CategoryFilter } from "./filters/CategoryFilter";
import { AgeFilter } from "./filters/AgeFilter";
import { TypeFilter } from "./filters/TypeFilter";
import { PriceFilter } from "./filters/PriceFilter";
import { DistanceFilter } from "./filters/DistanceFilter";
import { usePreferences } from '@/hooks/usePreferences';
import { useIsMobile } from '@/hooks/use-mobile';
import { PreferencesButton } from './filters/PreferencesButton';
import { MobileFilterButton } from './filters/MobileFilterButton';
import { DesktopFilters } from './filters/DesktopFilters';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export interface Filters {
  type?: string;
  ageRange?: string;
  activityType?: string;
  priceRange?: string;
  distance?: string;
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

  const renderMobileFilters = () => (
    <div className="space-y-4">
      <CategoryFilter
        value={filters.type}
        onChange={(value) => handleFilterChange('type', value)}
      />
      <AgeFilter
        value={filters.ageRange}
        onChange={(value) => handleFilterChange('ageRange', value)}
      />
      <TypeFilter
        value={filters.activityType}
        onChange={(value) => handleFilterChange('activityType', value)}
      />
      <PriceFilter
        value={filters.priceRange}
        onChange={(value) => handleFilterChange('priceRange', value)}
      />
      <DistanceFilter
        value={filters.distance}
        onChange={(value) => handleFilterChange('distance', value)}
      />
    </div>
  );

  return (
    <div className="bg-white shadow-soft rounded-2xl p-4 mb-6">
      <div className="flex gap-2 items-center">
        <div className="flex-shrink-0">
          <PreferencesButton 
            isActive={isPreferencesActive}
            onClick={handlePreferencesClick}
          />
        </div>

        {isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <MobileFilterButton activeFiltersCount={getActiveFiltersCount()} />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filter</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                {renderMobileFilters()}
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Schließen</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
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