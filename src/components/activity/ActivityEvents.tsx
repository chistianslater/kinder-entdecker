import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Users, Euro, ChevronDown, Ticket } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '../ui/button';
import { Activity } from '@/types/activity';

interface ActivityEventsProps {
  activity: Activity;
}

export const ActivityEvents = ({ activity }: ActivityEventsProps) => {
  const [limit, setLimit] = useState(5);

  const { data: events = [] } = useQuery({
    queryKey: ['activity-events', activity?.id, limit],
    queryFn: async () => {
      if (!activity?.id) return [];
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('activity_id', activity.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time')
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    enabled: !!activity?.id,
  });

  const handleLoadMore = () => {
    setLimit(prevLimit => prevLimit + 5);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Upcoming Events
      </h3>
      
      {events.length > 0 ? (
        <>
          <div className="space-y-3">
            {events.map((event) => (
              <div 
                key={event.id}
                className="bg-accent/10 rounded-lg p-4 space-y-2"
              >
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(event.start_time), 'MMM d, h:mm a')}
                  </span>
                  {event.max_participants && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Max {event.max_participants} participants
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Euro className="w-4 h-4" />
                    {event.price ? `€${event.price}` : 'Free'}
                  </span>
                </div>
                {activity.ticket_url && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => window.open(activity.ticket_url, '_blank', 'noopener,noreferrer')}
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Book Ticket
                  </Button>
                )}
              </div>
            ))}
          </div>
          {events.length >= limit && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleLoadMore}
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              Load More Events
            </Button>
          )}
        </>
      ) : (
        <p className="text-muted-foreground text-sm">No upcoming events scheduled</p>
      )}
    </div>
  );
};