import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';
import { filterByType, filterByAgeRange, filterByPrice, filterByDistance } from './filterUtils';

export const useFilteredActivities = (activities: Activity[]) => {
  const [filters, setFilters] = useState<Filters>({});
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  useEffect(() => {
    let result = [...activities];

    if (Object.keys(filters).length === 0) {
      setFilteredActivities([]);
      return;
    }

    if (filters.type) {
      result = filterByType(result, filters.type);
    }
    if (filters.ageRange) {
      result = filterByAgeRange(result, filters.ageRange);
    }
    if (filters.priceRange) {
      result = filterByPrice(result, filters.priceRange);
    }
    if (filters.distance) {
      result = filterByDistance(result, filters);
    }

    setFilteredActivities(result);
  }, [activities, filters]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return {
    filteredActivities,
    handleFiltersChange,
  };
};