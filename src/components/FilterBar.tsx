import React, { useState } from 'react';
import { TypeFilter } from './filters/TypeFilter';
import { AgeFilter } from './filters/AgeFilter';
import { PriceFilter } from './filters/PriceFilter';
import { CategoryFilter } from './filters/CategoryFilter';
import { DistanceFilter } from './filters/DistanceFilter';
import { Button } from '@/components/ui/button';
import { Heart, SlidersHorizontal } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';

export type Filters = {
  type?: string;
  ageRange?: string;
  priceRange?: string;
  category?: string;
  distance?: string;
};

interface FilterBarProps {
  onFiltersChange: (filters: Filters) => void;
}

const FilterBar = ({ onFiltersChange }: FilterBarProps) => {
  const [filters, setFilters] = useState<Filters>({});
  const [isPreferencesActive, setIsPreferencesActive] = useState(false);
  const { applyUserPreferences } = usePreferences({ onFiltersChange, setFilters });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePreferencesClick = () => {
    if (isPreferencesActive) {
      // Clear filters if deselecting
      setFilters({});
      onFiltersChange({});
      setIsPreferencesActive(false);
    } else {
      applyUserPreferences();
      setIsPreferencesActive(true);
    }
  };

  return (
    <div className="bg-white shadow-soft rounded-2xl p-6 mb-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
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
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
        <DistanceFilter
          value={filters.distance}
          onChange={(value) => handleFilterChange('distance', value)}
        />
        <TypeFilter 
          value={filters.type}
          onChange={(value) => handleFilterChange('type', value)}
        />
        <AgeFilter
          value={filters.ageRange}
          onChange={(value) => handleFilterChange('ageRange', value)}
        />
        <PriceFilter
          value={filters.priceRange}
          onChange={(value) => handleFilterChange('priceRange', value)}
        />
        <CategoryFilter
          value={filters.category}
          onChange={(value) => handleFilterChange('category', value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;