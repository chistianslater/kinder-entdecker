import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';

export const filterByType = (activities: Activity[], type?: string) => {
  if (!type) return activities;
  return activities.filter(activity => 
    activity.type.toLowerCase().includes(type.toLowerCase())
  );
};

export const filterByAgeRange = (activities: Activity[], ageRange?: string) => {
  if (!ageRange || ageRange === 'all') return activities;
  return activities.filter(activity => activity.age_range === ageRange);
};

export const filterByPrice = (activities: Activity[], priceRange?: string) => {
  if (!priceRange || priceRange === 'all') return activities;
  return activities.filter(activity => activity.price_range === priceRange);
};

export const filterByDistance = (activities: Activity[], filters: Filters) => {
  if (!filters.distance || filters.distance === 'all' || !filters.userLocation) {
    return activities;
  }

  const maxDistance = parseInt(filters.distance);
  if (isNaN(maxDistance)) return activities;

  return activities.filter(activity => {
    if (!activity.coordinates) return false;
    
    const distance = calculateDistance(
      filters.userLocation!.latitude,
      filters.userLocation!.longitude,
      activity.coordinates[0],
      activity.coordinates[1]
    );
    
    return distance <= maxDistance;
  });
};

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