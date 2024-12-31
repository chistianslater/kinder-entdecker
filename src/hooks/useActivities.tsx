import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';
import { supabase } from "@/integrations/supabase/client";
import { useFilteredActivities } from './filters/useFilteredActivities';
import { useQuery } from '@tanstack/react-query';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { filteredActivities, handleFiltersChange } = useFilteredActivities(activities);

  const { data, isLoading: loading, error, refetch: fetchActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Activity[];
    },
    initialData: [], // Set initial data to empty array
  });

  useEffect(() => {
    if (data) {
      setActivities(data);
    }
  }, [data]);

  return {
    filteredActivities: filteredActivities.length > 0 ? filteredActivities : activities, // Return all activities if no filters applied
    loading,
    error,
    handleFiltersChange,
    fetchActivities,
  };
};