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
import { Download } from 'lucide-react';

const ActivityList = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [importing, setImporting] = useState(false);
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

  const importDZTData = async () => {
    try {
      setImporting(true);
      
      // Fetch data from our Edge Function
      const { data: attractions, error: fetchError } = await supabase.functions.invoke('fetch-dzt-data');
      
      if (fetchError) throw fetchError;

      // Insert each attraction into our database
      for (const attraction of attractions) {
        const { error: insertError } = await supabase
          .from('activities')
          .insert([attraction]);

        if (insertError) {
          console.error('Error inserting attraction:', insertError);
          continue;
        }
      }

      toast({
        title: "Import erfolgreich",
        description: `${attractions.length} Aktivitäten wurden importiert.`,
      });

      // Refresh the activities list
      fetchActivities();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import fehlgeschlagen",
        description: "Die Aktivitäten konnten nicht importiert werden.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <FilterBar onFiltersChange={handleFiltersChange} />
        <Button
          onClick={importDZTData}
          disabled={importing}
          className="bg-primary hover:bg-primary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          {importing ? 'Importiere...' : 'DZT Daten importieren'}
        </Button>
      </div>
      
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