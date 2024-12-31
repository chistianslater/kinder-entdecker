import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "./filters/CategoryFilter";
import { AgeFilter } from "./filters/AgeFilter";
import { TypeFilter } from "./filters/TypeFilter";
import { PriceFilter } from "./filters/PriceFilter";
import { DistanceFilter } from "./filters/DistanceFilter";
import { Heart, SlidersHorizontal } from "lucide-react";
import { usePreferences } from '@/hooks/usePreferences';
import { useNavigate } from 'react-router-dom';

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

  // Get user location when distance filter is used
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
    // If a regular filter is changed while preferences are active,
    // deactivate preferences mode
    if (isPreferencesActive) {
      setIsPreferencesActive(false);
    }
    
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePreferencesClick = () => {
    if (isPreferencesActive) {
      // Clear all filters when deactivating preferences
      setFilters({});
      onFiltersChange({});
      setIsPreferencesActive(false);
    } else {
      // Apply user preferences
      applyUserPreferences();
      setIsPreferencesActive(true);
    }
  };

  return (
    <div className="bg-white shadow-soft rounded-2xl p-6 mb-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        <div className="flex gap-2">
          <Button
            variant={isPreferencesActive ? "default" : "outline"}
            className={`flex items-center gap-2 min-w-[140px] ${
              isPreferencesActive 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "bg-white hover:bg-secondary/80 border-accent"
            }`}
            onClick={handlePreferencesClick}
          >
            <Heart className="w-4 h-4" />
            Für Uns
            <SlidersHorizontal 
              className="w-4 h-4 cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                navigate('/dashboard');
              }}
            />
          </Button>
        </div>

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
    </div>
  );
};

export default FilterBar;