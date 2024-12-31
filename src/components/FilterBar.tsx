import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "./filters/CategoryFilter";
import { AgeFilter } from "./filters/AgeFilter";
import { TypeFilter } from "./filters/TypeFilter";
import { PriceFilter } from "./filters/PriceFilter";
import { DistanceFilter } from "./filters/DistanceFilter";
import { Heart, SlidersHorizontal, Filter } from "lucide-react";
import { usePreferences } from '@/hooks/usePreferences';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
  const navigate = useNavigate();
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

  const navigateToDashboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/dashboard');
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== undefined && value !== '').length;
  };

  const renderFilters = () => (
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

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white shadow-soft rounded-2xl p-4 mb-6">
      <div className="flex gap-2 items-center">
        <div className="flex-shrink-0">
          <Button
            variant={isPreferencesActive ? "default" : "outline"}
            className={`flex items-center gap-2 min-w-[120px] ${
              isPreferencesActive 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "bg-white hover:bg-secondary/80 border-accent"
            }`}
            onClick={handlePreferencesClick}
          >
            <Heart className="w-4 h-4" />
            {!isMobile && "Für Uns"}
            <SlidersHorizontal 
              className="w-4 h-4 cursor-pointer hover:text-primary" 
              onClick={navigateToDashboard}
            />
          </Button>
        </div>

        {isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-between bg-white hover:bg-secondary/80 border-accent"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </div>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-white px-2 py-0.5 rounded-full text-sm">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filter</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                {renderFilters()}
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Schließen</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <div className="flex gap-2">
            {renderFilters()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;