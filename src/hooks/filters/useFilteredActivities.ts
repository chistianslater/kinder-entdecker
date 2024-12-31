import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';
import { filterByType, filterByAgeRange, filterByPrice, filterByDistance } from './filterUtils';

export const useFilteredActivities = (activities: Activity[]) => {
  const [filters, setFilters] = useState<Filters>({});
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  useEffect(() => {
    let result = [...activities];

    // Only apply filters if there are any active filters
    if (Object.keys(filters).length > 0) {
      if (filters.type) {
        result = filterByType(result, filters.type);
      }
      if (filters.ageRange) {
        result = filterByAgeRange(result, filters.ageRange);
      }
      if (filters.priceRange) {
        result = filterByPrice(result, filters.priceRange);
      }
      if (filters.activityType && filters.activityType !== 'both') {
        result = result.filter(activity => activity.type === filters.activityType);
      }
      if (filters.distance && filters.distance !== 'all') {
        result = filterByDistance(result, filters);
      }
      setFilteredActivities(result);
    } else {
      setFilteredActivities([]);
    }
  }, [activities, filters]);

  const handleFiltersChange = (newFilters: Filters) => {
    // Remove any undefined or null values from the filters
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, value]) => value != null)
    ) as Filters;
    
    setFilters(cleanedFilters);
  };

  return {
    filteredActivities,
    handleFiltersChange,
  };
};