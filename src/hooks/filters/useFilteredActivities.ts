import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';
import { 
  filterByType, 
  filterByAgeRange, 
  filterByPrice, 
  filterByDistance,
  filterByActivityType 
} from './filterUtils';

export const useFilteredActivities = (activities: Activity[]) => {
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activities);

  useEffect(() => {
    setFilteredActivities(activities);
  }, [activities]);

  const handleFiltersChange = (filters: Filters) => {
    console.log('Applying filters:', filters);
    let filtered = [...activities];

    // Apply type filter
    if (filters.type) {
      filtered = filterByType(filtered, filters.type);
      console.log('After type filter:', filtered.length);
    }

    // Apply age range filter
    if (filters.ageRange && filters.ageRange !== 'all') {
      filtered = filterByAgeRange(filtered, filters.ageRange);
      console.log('After age filter:', filtered.length);
    }

    // Apply activity type filter (indoor/outdoor)
    if (filters.activityType && filters.activityType !== 'both') {
      filtered = filterByActivityType(filtered, filters.activityType);
      console.log('After activity type filter:', filtered.length);
    }

    // Apply price filter
    if (filters.priceRange && filters.priceRange !== 'all') {
      filtered = filterByPrice(filtered, filters.priceRange);
      console.log('After price filter:', filtered.length);
    }

    // Apply distance filter
    if (filters.distance && filters.distance !== 'all') {
      filtered = filterByDistance(filtered, filters);
      console.log('After distance filter:', filtered.length);
    }

    console.log('Final filtered activities:', filtered.length);
    setFilteredActivities(filtered);
  };

  return { filteredActivities, handleFiltersChange };
};