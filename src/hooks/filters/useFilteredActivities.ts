import { useState } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';
import { filterByType } from './filterUtils';
import { filterByAgeRange } from './filterUtils';
import { filterByPrice } from './filterUtils';
import { filterByDistance } from './filterUtils';

export const useFilteredActivities = (activities: Activity[]) => {
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activities);

  const handleFiltersChange = (filters: Filters) => {
    let filtered = [...activities];

    // Apply type filter
    filtered = filterByType(filtered, filters.type);

    // Apply age range filter
    filtered = filterByAgeRange(filtered, filters.ageRange);

    // Apply price filter
    filtered = filterByPrice(filtered, filters.priceRange);

    // Apply activity type filter
    if (filters.activityType && filters.activityType !== 'both') {
      filtered = filtered.filter(activity => activity.type === filters.activityType);
    }

    // Apply distance filter
    filtered = filterByDistance(filtered, filters);

    setFilteredActivities(filtered);
  };

  return {
    filteredActivities,
    handleFiltersChange,
  };
};