import React from 'react';
import { CategoryFilter } from "./CategoryFilter";
import { AgeFilter } from "./AgeFilter";
import { TypeFilter } from "./TypeFilter";
import { PriceFilter } from "./PriceFilter";
import { DistanceFilter } from "./DistanceFilter";
import { Filters } from '../FilterBar';

interface DesktopFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
}

export const DesktopFilters = ({ filters, onFilterChange }: DesktopFiltersProps) => {
  return (
    <div className="flex gap-2">
      <CategoryFilter
        value={filters.type}
        onChange={(value) => onFilterChange('type', value)}
      />
      <AgeFilter
        value={filters.ageRange}
        onChange={(value) => onFilterChange('ageRange', value)}
      />
      <TypeFilter
        value={filters.activityType}
        onChange={(value) => onFilterChange('activityType', value)}
      />
      <PriceFilter
        value={filters.priceRange}
        onChange={(value) => onFilterChange('priceRange', value)}
      />
      <DistanceFilter
        value={filters.distance}
        onChange={(value) => onFilterChange('distance', value)}
      />
    </div>
  );
};