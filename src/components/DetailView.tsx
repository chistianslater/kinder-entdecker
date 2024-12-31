import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Activity } from '@/types/activity';
import { ActivityDetails } from './activity/ActivityDetails';
import { ActivityBadges } from './activity/ActivityBadges';
import { ActivityLinks } from './activity/ActivityLinks';
import { ActivityReviews } from './activity/ActivityReviews';
import { MediaUpload } from './activity/MediaUpload';
import { Separator } from './ui/separator';
import { format } from 'date-fns';
import { Calendar, Users, Euro, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';

interface DetailViewProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailView = ({ activity, isOpen, onClose }: DetailViewProps) => {
  const [limit, setLimit] = useState(5);
  
  if (!activity) return null;

  const { data: events } = useQuery({
    queryKey: ['activity-events', activity.id, limit],
    queryFn: async () => {
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
  });

  const handleLoadMore = () => {
    setLimit(prevLimit => prevLimit + 5);
  };

  const handleNavigate = () => {
    const encodedAddress = encodeURIComponent(activity.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-primary">{activity.title}</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <img
            src={activity.image_url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b'}
            alt={activity.title}
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>

        <ActivityBadges activity={activity} className="mt-4" />

        <div className="mt-6">
          <p className="text-gray-600">{activity.description}</p>
        </div>

        <Separator className="my-6" />

        <ActivityDetails
          location={activity.location}
          openingHours={activity.opening_hours || 'Not specified'}
          priceRange={activity.price_range || 'Not specified'}
          ageRange={activity.age_range || 'Not specified'}
          type={activity.type}
          onNavigate={handleNavigate}
        />

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Events
          </h3>
          
          {events && events.length > 0 ? (
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

        <Separator className="my-6" />

        <ActivityLinks websiteUrl={activity.website_url} ticketUrl={activity.ticket_url} />

        <Separator className="my-6" />

        <ActivityReviews activity={activity} />

        <Separator className="my-6" />

        <MediaUpload activity={activity} />
      </SheetContent>
    </Sheet>
  );
};

export default DetailView;