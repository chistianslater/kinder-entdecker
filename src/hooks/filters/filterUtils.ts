import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';

export const filterByType = (activities: Activity[], type?: string) => {
  if (!type) return activities;
  console.log('Filtering by type:', type);
  console.log('Available types:', activities.map(a => a.type));
  return activities.filter(activity => 
    activity.type.toLowerCase() === type.toLowerCase()
  );
};

export const filterByAgeRange = (activities: Activity[], ageRange?: string) => {
  if (!ageRange || ageRange === 'all') return activities;
  console.log('Filtering by age range:', ageRange);
  console.log('Available age ranges:', activities.map(a => a.age_range));
  return activities.filter(activity => activity.age_range === ageRange);
};

export const filterByActivityType = (activities: Activity[], activityType?: string) => {
  if (!activityType || activityType === 'both') return activities;
  console.log('Filtering by activity type:', activityType);
  return activities.filter(activity => {
    if (!activity.type) return false;
    const type = activity.type.toLowerCase();
    const searchType = activityType.toLowerCase();
    return type === searchType || type.includes(searchType);
  });
};

export const filterByPrice = (activities: Activity[], priceRange?: string) => {
  if (!priceRange || priceRange === 'all') return activities;
  console.log('Filtering by price range:', priceRange);
  console.log('Available price ranges:', activities.map(a => a.price_range));
  
  return activities.filter(activity => {
    if (!activity.price_range) return false;
    const price = activity.price_range.toLowerCase();
    
    switch (priceRange.toLowerCase()) {
      case 'free':
        return price === 'free' || price === 'kostenlos';
      case 'low':
        return price === 'low' || price.includes('bis 10€');
      case 'medium':
        return price === 'medium' || price.includes('10-30€');
      case 'high':
        return price === 'high' || price.includes('30€+');
      default:
        return true;
    }
  });
};

export const filterByDistance = (activities: Activity[], filters: Filters) => {
  if (!filters.distance || filters.distance === 'all' || !filters.userLocation) {
    return activities;
  }

  console.log('Filtering by distance:', filters.distance);
  console.log('User location:', filters.userLocation);
  console.log('Available coordinates:', activities.map(a => a.coordinates));

  const maxDistance = parseInt(filters.distance);
  if (isNaN(maxDistance)) return activities;

  return activities.filter(activity => {
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