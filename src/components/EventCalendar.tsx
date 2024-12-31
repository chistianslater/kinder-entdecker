import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from '@/types/event';
import { Button } from './ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';

interface EventCalendarProps {
  activityId?: string;
}

export const EventCalendar = ({ activityId }: EventCalendarProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const { data: events = [] } = useQuery({
    queryKey: ['events', activityId],
    queryFn: async () => {
      const query = supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (activityId) {
        query.eq('activity_id', activityId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Event[];
    },
  });

  const eventsOnSelectedDate = events.filter(event => {
    if (!selectedDate) return false;
    return format(new Date(event.start_time), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  });

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border shadow"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Events {selectedDate && `for ${format(selectedDate, 'MMMM d, yyyy')}`}
          </h3>
          <div className="space-y-4">
            {eventsOnSelectedDate.length === 0 ? (
              <p className="text-muted-foreground">No events scheduled for this date.</p>
            ) : (
              eventsOnSelectedDate.map((event) => (
                <Card key={event.id} className="p-4 hover:shadow-soft transition-shadow">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <div className="mt-2 text-sm">
                    <p>Time: {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}</p>
                    {event.price && <p>Price: €{event.price}</p>}
                    {event.max_participants && <p>Max participants: {event.max_participants}</p>}
                  </div>
                  <Button variant="outline" className="mt-2 w-full">
                    Book Now
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};