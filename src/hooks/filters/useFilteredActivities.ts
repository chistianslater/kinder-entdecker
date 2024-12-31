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
import { supabase } from "@/integrations/supabase/client";

export const useFilteredActivities = (activities: Activity[]) => {
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activities);

  useEffect(() => {
    setFilteredActivities(activities);
  }, [activities]);

  const handleFiltersChange = async (filters: Filters) => {
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

    if (filters.minRating) {
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('activity_id, rating');

      if (reviewsData) {
        const avgRatings = reviewsData.reduce((acc, review) => {
          if (!acc[review.activity_id]) {
            acc[review.activity_id] = { sum: 0, count: 0 };
          }
          acc[review.activity_id].sum += review.rating;
          acc[review.activity_id].count += 1;
          return acc;
        }, {} as Record<string, { sum: number; count: number }>);

        filtered = filtered.filter(activity => {
          const activityRating = avgRatings[activity.id];
          if (!activityRating) return false;
          const average = activityRating.sum / activityRating.count;
          return average >= parseInt(filters.minRating!);
        });
      }
      console.log('After rating filter:', filtered.length);
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          filtered.sort((a, b) => {
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          });
          break;
        case 'oldest':
          filtered.sort((a, b) => {
            return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
          });
          break;
        case 'rating':
          const { data: reviewsData } = await supabase
            .from('reviews')
            .select('activity_id, rating');

          if (reviewsData) {
            const avgRatings = reviewsData.reduce((acc, review) => {
              if (!acc[review.activity_id]) {
                acc[review.activity_id] = { sum: 0, count: 0 };
              }
              acc[review.activity_id].sum += review.rating;
              acc[review.activity_id].count += 1;
              return acc;
            }, {} as Record<string, { sum: number; count: number }>);

            filtered.sort((a, b) => {
              const ratingA = avgRatings[a.id]
                ? avgRatings[a.id].sum / avgRatings[a.id].count
                : 0;
              const ratingB = avgRatings[b.id]
                ? avgRatings[b.id].sum / avgRatings[b.id].count
                : 0;
              return ratingB - ratingA;
            });
          }
          break;
        case 'distance':
          if (filters.userLocation) {
            filtered.sort((a, b) => {
              const distanceA = calculateDistance(
                filters.userLocation!.latitude,
                filters.userLocation!.longitude,
                a.coordinates?.x || 0,
                a.coordinates?.y || 0
              );
              const distanceB = calculateDistance(
                filters.userLocation!.latitude,
                filters.userLocation!.longitude,
                b.coordinates?.x || 0,
                b.coordinates?.y || 0
              );
              return distanceA - distanceB;
            });
          }
          break;
      }
    }

    console.log('Final filtered activities:', filtered.length);
    setFilteredActivities(filtered);
  };

  return { filteredActivities, handleFiltersChange };
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}