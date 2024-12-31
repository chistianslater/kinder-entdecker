import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Filters } from '@/components/FilterBar';
import { supabase } from "@/integrations/supabase/client";
import { useFilteredActivities } from './filters/useFilteredActivities';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { filteredActivities, handleFiltersChange } = useFilteredActivities(activities);
  const { toast } = useToast();

  const { data, isLoading: loading, error, refetch: fetchActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Error loading activities",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data as Activity[];
    },
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching activities:', error);
        toast({
          title: "Error",
          description: "Failed to load activities. Please try again.",
          variant: "destructive",
        });
      },
    },
  });

  useEffect(() => {
    if (data) {
      setActivities(data);
    }
  }, [data]);

  return {
    activities,
    filteredActivities,
    loading,
    error,
    handleFiltersChange,
    fetchActivities,
  };
};