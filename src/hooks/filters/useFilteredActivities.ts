import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';
import { filterByType, filterByAgeRange, filterByPrice, filterByDistance } from './filterUtils';

export const useFilteredActivities = (activities: Activity[]) => {
  const [filters, setFilters] = useState<Filters>({});
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  useEffect(() => {
    let result = [...activities];

    // Apply filters if they exist
    if (Object.keys(filters).length > 0) {
      // Filter by category (type)
      if (filters.type) {
        result = result.filter(activity => 
          activity.type.toLowerCase() === filters.type.toLowerCase()
        );
      }

      // Filter by age range
      if (filters.ageRange && filters.ageRange !== 'all') {
        result = result.filter(activity => 
          activity.age_range === filters.ageRange
        );
      }

      // Filter by activity type (indoor/outdoor)
      if (filters.activityType && filters.activityType !== 'both') {
        result = result.filter(activity => 
          activity.type.toLowerCase().includes(filters.activityType.toLowerCase())
        );
      }

      // Filter by price range
      if (filters.priceRange) {
        switch (filters.priceRange) {
          case 'free':
            result = result.filter(activity => 
              activity.price_range === 'free' || activity.price_range === 'kostenlos'
            );
            break;
          case 'low':
            result = result.filter(activity => 
              activity.price_range === 'low' || activity.price_range?.includes('bis 10€')
            );
            break;
          case 'medium':
            result = result.filter(activity => 
              activity.price_range === 'medium' || activity.price_range?.includes('10-30€')
            );
            break;
          case 'high':
            result = result.filter(activity => 
              activity.price_range === 'high' || activity.price_range?.includes('30€+')
            );
            break;
        }
      }

      // Filter by distance if user location is available
      if (filters.distance && filters.distance !== 'all' && filters.userLocation) {
        result = filterByDistance(result, filters);
      }

      setFilteredActivities(result);
    } else {
      setFilteredActivities([]);
    }
  }, [activities, filters]);

  const handleFiltersChange = (newFilters: Filters) => {
    console.log('Applying filters:', newFilters);
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