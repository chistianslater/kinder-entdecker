import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Activity } from '@/types/activity';
import { useToast } from "@/components/ui/use-toast";
import { Filters } from '@/components/FilterBar';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      console.log('Fetching activities...');
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }
      
      console.log('Activities fetched:', data);
      setActivities(data || []);
      setFilteredActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Fehler",
        description: "Aktivitäten konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: Filters) => {
    let filtered = [...activities];

    if (filters.type && filters.type !== 'both') {
      filtered = filtered.filter(activity => activity.type === filters.type);
    }

    if (filters.ageRange && filters.ageRange !== 'all') {
      filtered = filtered.filter(activity => activity.age_range?.includes(filters.ageRange || ''));
    }

    if (filters.priceRange) {
      filtered = filtered.filter(activity => {
        switch (filters.priceRange) {
          case 'free':
            return activity.price_range?.toLowerCase().includes('kostenlos');
          case 'low':
            return activity.price_range?.toLowerCase().includes('günstig');
          case 'medium':
            return activity.price_range?.toLowerCase().includes('mittel');
          case 'high':
            return activity.price_range?.toLowerCase().includes('teuer');
          default:
            return true;
        }
      });
    }

    if (filters.category) {
      filtered = filtered.filter(activity => 
        activity.type.toLowerCase().includes(filters.category?.toLowerCase() || '')
      );
    }

    setFilteredActivities(filtered);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    filteredActivities,
    loading,
    handleFiltersChange,
    fetchActivities
  };
};