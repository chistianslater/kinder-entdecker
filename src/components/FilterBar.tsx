import React, { useState } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { FilterDialog } from './filters/FilterDialog';
import { SortSelect } from './filters/SortSelect';
import { FilterButtons } from './filters/FilterButtons';

export interface Filters {
  type?: string;
  ageRange?: string;
  activityType?: string;
  priceRange?: string;
  distance?: string;
  openingHours?: string;
  minRating?: string;
  sortBy?: string;
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

  const handleReset = () => {
    setFilters({});
    onFiltersChange({});
    setIsPreferencesActive(false);
  };

  const getActiveFiltersCount = () => {
    const { sortBy, ...otherFilters } = filters;
    return Object.values(otherFilters).filter(value => value !== undefined && value !== '').length;
  };

  return (
    <div className="modern-card text-white">
      <div className="flex items-center gap-3 flex-wrap">
        <FilterButtons 
          isPreferencesActive={isPreferencesActive}
          onPreferencesClick={handlePreferencesClick}
          activeFiltersCount={getActiveFiltersCount()}
          onFilterClick={() => setShowFilterDialog(true)}
          onReset={handleReset}
        />
        <SortSelect
          value={filters.sortBy}
          onChange={(value) => handleFilterChange('sortBy', value)}
        />
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