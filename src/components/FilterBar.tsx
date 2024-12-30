import React, { useState } from 'react';
import { TypeFilter } from './filters/TypeFilter';
import { AgeFilter } from './filters/AgeFilter';
import { PriceFilter } from './filters/PriceFilter';
import { CategoryFilter } from './filters/CategoryFilter';

export type Filters = {
  type?: string;
  ageRange?: string;
  priceRange?: string;
  category?: string;
};

interface FilterBarProps {
  onFiltersChange: (filters: Filters) => void;
}

const FilterBar = ({ onFiltersChange }: FilterBarProps) => {
  const [filters, setFilters] = useState<Filters>({});

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="bg-white shadow-soft rounded-2xl p-6 mb-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
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