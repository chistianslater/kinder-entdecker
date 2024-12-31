import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';

export const useFilteredActivities = (activities: Activity[]) => {
  const [filters, setFilters] = useState<Filters>({});
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  useEffect(() => {
    console.log('Starting filtering with activities:', activities.length);
    console.log('Current filters:', filters);

    let result = [...activities];

    if (Object.keys(filters).length > 0) {
      // Filter by type (category)
      if (filters.type) {
        console.log('Filtering by type:', filters.type);
        result = result.filter(activity => {
          const match = activity.type === filters.type;
          console.log(`Activity ${activity.title} type: ${activity.type}, expected type: ${filters.type}, match: ${match}`);
          return match;
        });
        console.log('After type filter:', result.length);
      }

      // Filter by age range
      if (filters.ageRange && filters.ageRange !== 'all') {
        console.log('Filtering by age range:', filters.ageRange);
        result = result.filter(activity => {
          if (!activity.age_range) return false;
          
          // Handle "Alle Altersgruppen" as a special case
          if (activity.age_range.toLowerCase().includes('alle')) return true;
          
          // Extract numbers from the filter range (e.g., "3-5" -> [3, 5])
          const [filterMin, filterMax] = filters.ageRange.split('-').map(Number);
          
          // Extract numbers from activity age range
          const activityAgeMatch = activity.age_range.match(/\d+/g);
          if (!activityAgeMatch) return false;
          
          // If activity has a single number (e.g., "ab 3 Jahre"), treat it as minimum age
          if (activityAgeMatch.length === 1) {
            const activityAge = Number(activityAgeMatch[0]);
            return activityAge >= filterMin && activityAge <= filterMax;
          }
          
          // If activity has a range (e.g., "3-5 Jahre"), check for overlap
          if (activityAgeMatch.length >= 2) {
            const activityMin = Number(activityAgeMatch[0]);
            const activityMax = Number(activityAgeMatch[1]);
            
            // Check if ranges overlap
            return !(activityMax < filterMin || activityMin > filterMax);
          }
          
          return false;
        });
        console.log('After age filter:', result.length);
      }

      // Filter by price range
      if (filters.priceRange) {
        console.log('Filtering by price range:', filters.priceRange);
        result = result.filter(activity => {
          if (!activity.price_range) return false;
          
          const price = activity.price_range.toLowerCase();
          console.log(`Checking price for ${activity.title}:`, price);
          
          // Extract minimum and maximum prices from the range
          const numbers = price.match(/\d+/g);
          if (!numbers) {
            // Handle special cases like "kostenlos" or "free"
            const isFree = price.includes('kostenlos') || price.includes('free') || price === '0€' || price === '0';
            console.log(`Activity is free: ${isFree}`);
            return filters.priceRange === 'free' ? isFree : false;
          }
          
          // Get both minimum and maximum prices if available
          const prices = numbers.map(Number);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          console.log(`Price range for ${activity.title}: ${minPrice}€ - ${maxPrice}€`);
          
          switch (filters.priceRange) {
            case 'free':
              return price.includes('kostenlos') || price.includes('free') || price === '0€' || price === '0';
            case 'low':
              return maxPrice > 0 && maxPrice <= 10;
            case 'medium':
              return minPrice > 10 && maxPrice <= 30;
            case 'high':
              return minPrice > 30;
            default:
              return true;
          }
        });
        console.log('After price filter:', result.length);
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

      // Filter by distance if user location is available
      if (filters.distance && filters.distance !== 'all' && filters.userLocation) {
        const maxDistance = parseInt(filters.distance);
        if (!isNaN(maxDistance)) {
          result = result.filter(activity => {
            if (!activity.coordinates) return false;
            
            // Parse coordinates from the point type
            const coords = activity.coordinates.toString()
              .replace('(', '')
              .replace(')', '')
              .split(',')
              .map(coord => parseFloat(coord.trim()));
            
            if (coords.length !== 2) return false;
            
            const [activityLng, activityLat] = coords;
            
            if (isNaN(activityLat) || isNaN(activityLng)) return false;
            
            const distance = calculateDistance(
              filters.userLocation!.latitude,
              filters.userLocation!.longitude,
              activityLat,
              activityLng
            );
            
            console.log(`Distance for ${activity.title}: ${distance}km`);
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