import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Filters } from '@/components/FilterBar';
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';

interface UsePreferencesProps {
  onFiltersChange: (filters: Filters) => void;
  setFilters: (filters: Filters) => void;
}

export const usePreferences = ({ onFiltersChange, setFilters }: UsePreferencesProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: preferences } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        toast({
          title: "Error loading preferences",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    retry: false,
  });

  const applyUserPreferences = async () => {
    try {
      setLoading(true);
      if (preferences) {
        const newFilters: Filters = {
          type: preferences.interests?.[0],
          ageRange: preferences.child_age_ranges?.[0],
          distance: preferences.max_distance?.toString(),
        };
        setFilters(newFilters);
        onFiltersChange(newFilters);
      }
    } catch (error) {
      console.error('Error applying preferences:', error);
      toast({
        title: "Error",
        description: "Failed to apply preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    loading,
    applyUserPreferences,
  };
};