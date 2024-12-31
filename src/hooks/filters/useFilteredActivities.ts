import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';

export const useFilteredActivities = (activities: Activity[]) => {
  const [filters, setFilters] = useState<Filters>({});
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  const mapTypeFilter = (filterType: string): string => {
    const typeMapping: { [key: string]: string } = {
      'sports': 'Sport & Bewegung',
      'nature': 'Natur & Wandern',
      'culture': 'Kultur & Museum',
      'creative': 'Kreativ & Basteln',
      'animals': 'Tiere & Zoo'
    };
    return typeMapping[filterType] || filterType;
  };

  useEffect(() => {
    console.log('Starting filtering with activities:', activities.length);
    console.log('Current filters:', filters);

    let result = [...activities];

    if (Object.keys(filters).length > 0) {
      // Filter by category (type)
      if (filters.type) {
        const mappedType = mapTypeFilter(filters.type);
        console.log('Filtering by type:', mappedType);
        result = result.filter(activity => {
          const match = activity.type === mappedType;
          console.log(`Activity ${activity.title} type: ${activity.type}, mapped type: ${mappedType}, match: ${match}`);
          return match;
        });
        console.log('After type filter:', result.length);
      }

      // Filter by age range
      if (filters.ageRange && filters.ageRange !== 'all') {
        console.log('Filtering by age range:', filters.ageRange);
        result = result.filter(activity => {
          const match = activity.age_range === filters.ageRange;
          console.log(`Activity ${activity.title} age range: ${activity.age_range}, filter: ${filters.ageRange}, match: ${match}`);
          return match;
        });
        console.log('After age filter:', result.length);
      }

      // Filter by activity type (indoor/outdoor)
      if (filters.activityType && filters.activityType !== 'both') {
        console.log('Filtering by activity type:', filters.activityType);
        result = result.filter(activity => {
          const location = activity.location.toLowerCase();
          let match = false;
          if (filters.activityType === 'indoor') {
            match = location.includes('indoor') || location.includes('drinnen');
          } else {
            match = location.includes('outdoor') || location.includes('draußen');
          }
          console.log(`Activity ${activity.title} location: ${location}, match: ${match}`);
          return match;
        });
        console.log('After activity type filter:', result.length);
      }

      // Filter by price range
      if (filters.priceRange) {
        console.log('Filtering by price range:', filters.priceRange);
        result = result.filter(activity => {
          if (!activity.price_range) return false;
          const price = activity.price_range.toLowerCase();
          let match = false;
          
          switch (filters.priceRange) {
            case 'free':
              match = price.includes('kostenlos') || price.includes('free');
              break;
            case 'low':
              match = price.includes('günstig') || price.includes('bis 10€');
              break;
            case 'medium':
              match = price.includes('10-30€');
              break;
            case 'high':
              match = price.includes('30€+');
              break;
            default:
              match = true;
          }
          console.log(`Activity ${activity.title} price: ${price}, match: ${match}`);
          return match;
        });
        console.log('After price filter:', result.length);
      }

      // Filter by distance if user location is available
      if (filters.distance && filters.distance !== 'all' && filters.userLocation) {
        console.log('Filtering by distance:', filters.distance);
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
            
            const match = distance <= maxDistance;
            console.log(`Activity ${activity.title} distance: ${distance}km, max: ${maxDistance}km, match: ${match}`);
            return match;
          });
          console.log('After distance filter:', result.length);
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