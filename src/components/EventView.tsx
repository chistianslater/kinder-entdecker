import React from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from '@/types/event';
import { format } from "date-fns";
import { Calendar, Clock, Users, Euro } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

const EventView = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          activities (
            title,
            location,
            image_url
          )
        `)
        .order('start_time', { ascending: true })
        .gte('start_time', new Date().toISOString());

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-4 space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <img
            src={event.activities.image_url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b'}
            alt={event.activities.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-primary">{event.title}</h3>
              <p className="text-sm text-muted-foreground">{event.activities.title}</p>
              <p className="text-sm text-muted-foreground">{event.activities.location}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{format(new Date(event.start_time), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>
                  {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                </span>
              </div>
              {event.max_participants && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Max {event.max_participants} participants</span>
                </div>
              )}
              {event.price && (
                <div className="flex items-center gap-2 text-sm">
                  <Euro className="w-4 h-4 text-primary" />
                  <span>€{event.price}</span>
                </div>
              )}
            </div>

            <Button className="w-full">
              Book Now
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EventView;