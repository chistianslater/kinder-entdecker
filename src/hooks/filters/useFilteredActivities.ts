import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';

export const useFilteredActivities = (activities: Activity[]) => {
  const [filters, setFilters] = useState<Filters>({});
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  const typeMapping: { [key: string]: string } = {
    'sports': 'Sport & Bewegung',
    'nature': 'Natur & Wandern',
    'culture': 'Kultur & Museum',
    'creative': 'Kreativ & Basteln',
    'animals': 'Tiere & Zoo'
  };

  useEffect(() => {
    console.log('Starting filtering with activities:', activities.length);
    console.log('Current filters:', filters);

    let result = [...activities];

    if (Object.keys(filters).length > 0) {
      // Filter by category (type)
      if (filters.type) {
        const mappedType = typeMapping[filters.type];
        console.log('Filtering by type:', mappedType);
        result = result.filter(activity => {
          const match = activity.type === mappedType;
          console.log(`Activity ${activity.title} type: ${activity.type}, expected type: ${mappedType}, match: ${match}`);
          return match;
        });
        console.log('After type filter:', result.length);
      }

      // Filter by age range
      if (filters.ageRange && filters.ageRange !== 'all') {
        result = result.filter(activity => activity.age_range === filters.ageRange);
      }

      // Filter by activity type (indoor/outdoor)
      if (filters.activityType && filters.activityType !== 'both') {
        result = result.filter(activity => {
          const location = activity.location.toLowerCase();
          if (filters.activityType === 'indoor') {
            return location.includes('indoor') || location.includes('drinnen');
          } else {
            return location.includes('outdoor') || location.includes('draußen');
          }
        });
      }

      // Filter by price range
      if (filters.priceRange) {
        result = result.filter(activity => {
          if (!activity.price_range) return false;
          const price = activity.price_range.toLowerCase();
          
          switch (filters.priceRange) {
            case 'free':
              return price.includes('kostenlos') || price.includes('free');
            case 'low':
              return price.includes('günstig') || price.includes('bis 10€');
            case 'medium':
              return price.includes('10-30€');
            case 'high':
              return price.includes('30€+');
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
    }

    console.log('Final filtered activities:', result);
    setFilteredActivities(result);
  }, [activities, filters]);

  const handleFiltersChange = (newFilters: Filters) => {
    console.log('Setting new filters:', newFilters);
    setFilters(newFilters);
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