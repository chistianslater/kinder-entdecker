import React, { useState } from 'react';
import { Activity } from '@/types/activity';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoadingState from './activity/LoadingState';
import EmptyState from './activity/EmptyState';
import ActivityListContent from './activity/ActivityListContent';
import { useActivities } from '@/hooks/useActivities';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';
import ActivityListHeader from './activity/ActivityListHeader';
import ActivityListDialogs from './activity/ActivityListDialogs';

const ActivityList = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const { toast } = useToast();
  const { businessProfile } = useBusinessProfile();
  const { 
    filteredActivities, 
    activities,
    loading, 
    handleFiltersChange,
    fetchActivities 
  } = useActivities();

  const handleClaimActivity = async (activityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('activities')
        .update({ claimed_by: user.id, is_business: true })
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
    <div className="relative">
      <ActivityListHeader 
        onFiltersChange={handleFiltersChange}
        onCreateClick={() => setShowCreateDialog(true)}
      />
      
      <div className="mt-8">
        {filteredActivities.length === 0 ? (
          <EmptyState />
        ) : (
          <ActivityListContent
            activities={filteredActivities}
            onSelect={setSelectedActivity}
            onClaim={handleClaimActivity}
            onEdit={setActivityToEdit}
            showClaimButton={!!businessProfile}
            onRefresh={fetchActivities}
          />
        )}
      </div>

      <ActivityListDialogs 
        selectedActivity={selectedActivity}
        showCreateDialog={showCreateDialog}
        activityToEdit={activityToEdit}
        onCloseDetail={() => setSelectedActivity(null)}
        onCreateDialogChange={setShowCreateDialog}
        onEditDialogChange={(open) => !open && setActivityToEdit(null)}
        onSuccess={fetchActivities}
      />
    </div>
  );
};

export default ActivityList;