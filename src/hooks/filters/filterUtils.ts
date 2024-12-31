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
    
    const distance = calculateDistance(
      filters.userLocation!.latitude,
      filters.userLocation!.longitude,
      activity.coordinates.x,
      activity.coordinates.y
    );
    
    return distance <= maxDistance;
  });
};

export const filterByOpeningHours = (activities: Activity[], openingHours?: string) => {
  if (!openingHours || openingHours === 'all') return activities;
  
  const now = new Date();
  const currentDay = now.toLocaleDateString('de-DE', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  return activities.filter(activity => {
    if (!activity.opening_hours) {
      return openingHours === 'closed';
    }

    // Parse opening hours string (assuming format like "Mo-Fr: 9:00-17:00")
    const isOpen = activity.opening_hours.toLowerCase().split('\n').some(schedule => {
      const [days, hours] = schedule.split(':').map(s => s.trim());
      if (!hours) return false;

      // Check if current day is in the schedule
      const isDayIncluded = days.split(',').some(dayRange => {
        const [start, end] = dayRange.split('-').map(d => d.trim());
        const daysOfWeek = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'];
        const startIdx = daysOfWeek.indexOf(start.toLowerCase());
        const endIdx = end ? daysOfWeek.indexOf(end.toLowerCase()) : startIdx;
        const currentIdx = daysOfWeek.indexOf(currentDay);
        return currentIdx >= startIdx && currentIdx <= endIdx;
      });

      if (!isDayIncluded) return false;

      // Check if current time is within opening hours
      const [openTime, closeTime] = hours.split('-').map(t => t.trim());
      return currentTime >= openTime && currentTime <= closeTime;
    });

    return openingHours === 'open' ? isOpen : !isOpen;
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
