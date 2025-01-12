import React from 'react';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const ActivityList = () => {
  const { businessProfile } = useBusinessProfile();

  const { data: activities } = useQuery({
    queryKey: ['activities', businessProfile?.id],
    queryFn: async () => {
      if (!businessProfile?.id) return [];

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('business_id', businessProfile.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching activities:', error);
        return [];
      }

      return data;
    },
    enabled: !!businessProfile?.id,
  });

  if (!activities || activities.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground text-center">Keine Aktivitäten vorhanden</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <ScrollArea className="h-[300px] w-full">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-4 rounded-lg bg-accent/20"
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(activity.created_at).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};