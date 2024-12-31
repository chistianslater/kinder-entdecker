import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';
import { supabase } from "@/integrations/supabase/client";
import { useFilteredActivities } from './filters/useFilteredActivities';
import { useQuery } from '@tanstack/react-query';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { filteredActivities, handleFiltersChange } = useFilteredActivities(activities);

  const { data, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*');
      
      if (error) throw error;
      return data as Activity[];
    },
  });

  useEffect(() => {
    if (data) {
      setActivities(data);
    }
  }, [data]);

  return {
    activities: filteredActivities,
    isLoading,
    error,
    handleFiltersChange,
  };
};