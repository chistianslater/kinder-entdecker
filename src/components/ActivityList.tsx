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
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { CreateActivityDialog } from './activity/CreateActivityDialog';

const ActivityList = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
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
      <div className="group sticky top-0 z-20 pt-4 pb-2 -mx-4 px-4 border-b transition-colors duration-200">
        <div className="absolute inset-0 group-[.is-sticky]:bg-background/98 group-[.is-sticky]:backdrop-blur supports-[backdrop-filter]:group-[.is-sticky]:bg-background/60" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <FilterBar onFiltersChange={handleFiltersChange} />
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="ml-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Aktivität erstellen
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        {filteredActivities.length === 0 ? (
          <EmptyState />
        ) : (
          <ActivityListContent
            activities={filteredActivities}
            onSelect={setSelectedActivity}
            onClaim={handleClaimActivity}
            showClaimButton={!!businessProfile}
          />
        )}
      </div>

      <DetailView 
        activity={selectedActivity}
        isOpen={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
      />

      <CreateActivityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={fetchActivities}
      />
    </div>
  );
};

export default ActivityList;