import React, { useState } from 'react';
import DetailView from './DetailView';
import { Activity } from '@/types/activity';
import FilterBar from './FilterBar';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoadingState from './activity/LoadingState';
import EmptyState from './activity/EmptyState';
import ActivityListContent from './activity/ActivityListContent';
import { useActivities } from '@/hooks/useActivities';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';

const ActivityList = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const { toast } = useToast();
  const { userBusinessProfile } = useBusinessProfile();
  const { 
    filteredActivities, 
    loading, 
    handleFiltersChange,
    fetchActivities 
  } = useActivities();

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
    return <LoadingState />;
  }

  return (
    <div className="space-y-4 p-4">
      <FilterBar onFiltersChange={handleFiltersChange} />
      
      {filteredActivities.length === 0 ? (
        <EmptyState />
      ) : (
        <ActivityListContent
          activities={filteredActivities}
          onSelect={setSelectedActivity}
          onClaim={handleClaimActivity}
          showClaimButton={!!userBusinessProfile}
        />
      )}

      <DetailView 
        activity={selectedActivity}
        isOpen={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};

export default ActivityList;