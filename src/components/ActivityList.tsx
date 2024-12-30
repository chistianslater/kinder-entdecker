import React, { useState, useEffect } from 'react';
import { ActivityCard } from './activity/ActivityCard';
import DetailView from './DetailView';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Activity } from '@/types/activity';
import { Filters } from './FilterBar';
import FilterBar from './FilterBar';

const ActivityList = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [userBusinessProfile, setUserBusinessProfile] = useState<any>(null);

  useEffect(() => {
    fetchActivities();
    checkBusinessProfile();
  }, []);

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

  const checkBusinessProfile = async () => {
    try {
      console.log('Checking business profile...');
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('User found:', user.id);
        const { data, error } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching business profile:', error);
          throw error;
        }

        console.log('Business profile:', data);
        setUserBusinessProfile(data);
      }
    } catch (error) {
      console.error('Error checking business profile:', error);
    }
  };

  const handleClaimActivity = async (activityId: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({ claimed_by: userBusinessProfile.user_id, is_business: true })
        .eq('id', activityId);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Aktivität erfolgreich beansprucht.",
      });

      fetchActivities();
    } catch (error) {
      console.error('Error claiming activity:', error);
      toast({
        title: "Fehler",
        description: "Aktivität konnte nicht beansprucht werden.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-4">Lädt Aktivitäten...</div>;
  }

  if (filteredActivities.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-muted-foreground">
          Keine Aktivitäten gefunden. Versuche andere Filter-Einstellungen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <FilterBar onFiltersChange={handleFiltersChange} />
      
      {filteredActivities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onSelect={setSelectedActivity}
          onClaim={handleClaimActivity}
          showClaimButton={!!userBusinessProfile}
        />
      ))}

      <DetailView 
        activity={selectedActivity}
        isOpen={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};

export default ActivityList;
