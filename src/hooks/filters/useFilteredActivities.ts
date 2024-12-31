import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';
import { filterByType, filterByAgeRange, filterByPrice, filterByDistance } from './filterUtils';

export const useFilteredActivities = (activities: Activity[]) => {
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activities);

  const handleFiltersChange = (filters: Filters) => {
    let filtered = [...activities];

    // Apply type filter
    if (filters.type) {
      filtered = filterByType(filtered, filters.type);
    }

    // Apply age range filter
    if (filters.ageRange && filters.ageRange !== 'all') {
      filtered = filterByAgeRange(filtered, filters.ageRange);
    }

    // Apply price filter
    if (filters.priceRange) {
      filtered = filterByPrice(filtered, filters.priceRange);
    }

    // Apply distance filter
    if (filters.distance && filters.distance !== 'all') {
      filtered = filterByDistance(filtered, filters);
    }

    setFilteredActivities(filtered);
  };

  return { filteredActivities, handleFiltersChange };
};