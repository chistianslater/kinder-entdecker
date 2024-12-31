import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';

export const useFilteredActivities = (activities: Activity[]) => {
  const [filters, setFilters] = useState<Filters>({});
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  useEffect(() => {
    let result = [...activities];

    // Apply filters if they exist
    if (Object.keys(filters).length > 0) {
      console.log('Applying filters:', filters);

      // Filter by category (type)
      if (filters.type) {
        result = result.filter(activity => {
          const normalizedActivityType = activity.type.toLowerCase();
          const normalizedFilterType = filters.type.toLowerCase();
          return normalizedActivityType === normalizedFilterType;
        });
      }

      // Filter by age range
      if (filters.ageRange && filters.ageRange !== 'all') {
        result = result.filter(activity => {
          if (!activity.age_range) return false;
          return activity.age_range === filters.ageRange;
        });
      }

      // Filter by price range
      if (filters.priceRange) {
        result = result.filter(activity => {
          if (!activity.price_range) return false;
          
          switch (filters.priceRange) {
            case 'free':
              return activity.price_range.toLowerCase().includes('kostenlos') || 
                     activity.price_range.toLowerCase().includes('free');
            case 'low':
              return activity.price_range.toLowerCase().includes('günstig') || 
                     activity.price_range.toLowerCase().includes('bis 10€');
            case 'medium':
              return activity.price_range.toLowerCase().includes('10-30€');
            case 'high':
              return activity.price_range.toLowerCase().includes('30€+');
            default:
              return true;
          }
        });
      }

      // Filter by distance if user location is available
      if (filters.distance && filters.distance !== 'all' && filters.userLocation) {
        const maxDistance = parseInt(filters.distance);
        if (!isNaN(maxDistance)) {
          result = result.filter(activity => {
            if (!activity.coordinates) return false;
            
            // Parse coordinates from the point type
            const coords = activity.coordinates.toString().replace('(', '').replace(')', '').split(',');
            const activityLat = parseFloat(coords[0]);
            const activityLng = parseFloat(coords[1]);
            
            if (isNaN(activityLat) || isNaN(activityLng)) return false;
            
            const distance = calculateDistance(
              filters.userLocation!.latitude,
              filters.userLocation!.longitude,
              activityLat,
              activityLng
            );
            
            return distance <= maxDistance;
          });
        }
      }

      setFilteredActivities(result);
    } else {
      setFilteredActivities(activities);
    }
  }, [activities, filters]);

  const handleFiltersChange = (newFilters: Filters) => {
    console.log('New filters:', newFilters);
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

// Helper function to calculate distance between two points using the Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};