import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';
import { 
  filterByType, 
  filterByAgeRange, 
  filterByPrice, 
  filterByDistance,
  filterByActivityType,
  filterByOpeningHours
} from './filterUtils';

export const useFilteredActivities = (activities: Activity[]) => {
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activities);

  useEffect(() => {
    setFilteredActivities(activities);
  }, [activities]);

  const handleFiltersChange = (filters: Filters) => {
    console.log('Applying filters:', filters);
    let filtered = [...activities];

    if (filters.type) {
      filtered = filterByType(filtered, filters.type);
      console.log('After type filter:', filtered.length);
    }

    if (filters.ageRange && filters.ageRange !== 'all') {
      filtered = filterByAgeRange(filtered, filters.ageRange);
      console.log('After age filter:', filtered.length);
    }

    if (filters.activityType && filters.activityType !== 'both') {
      filtered = filterByActivityType(filtered, filters.activityType);
      console.log('After activity type filter:', filtered.length);
    }

    if (filters.priceRange && filters.priceRange !== 'all') {
      filtered = filterByPrice(filtered, filters.priceRange);
      console.log('After price filter:', filtered.length);
    }

    if (filters.distance && filters.distance !== 'all') {
      filtered = filterByDistance(filtered, filters);
      console.log('After distance filter:', filtered.length);
    }

    if (filters.openingHours && filters.openingHours !== 'all') {
      filtered = filterByOpeningHours(filtered, filters.openingHours);
      console.log('After opening hours filter:', filtered.length);
    }

    console.log('Final filtered activities:', filtered.length);
    setFilteredActivities(filtered);
  };

  return { filteredActivities, handleFiltersChange };
};