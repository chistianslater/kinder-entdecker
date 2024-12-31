import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Activity } from '@/types/activity';
import { ActivityDetails } from './activity/ActivityDetails';
import { ActivityBadges } from './activity/ActivityBadges';
import { ActivityLinks } from './activity/ActivityLinks';
import { ActivityReviews } from './activity/ActivityReviews';
import { ActivityEvents } from './activity/ActivityEvents';
import { MediaUpload } from './activity/MediaUpload';
import { Separator } from './ui/separator';

interface DetailViewProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailView = ({ activity, isOpen, onClose }: DetailViewProps) => {
  const handleNavigate = () => {
    if (!activity) return;
    const encodedAddress = encodeURIComponent(activity.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank', 'noopener,noreferrer');
  };

  if (!activity) return null;

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

        <ActivityEvents activity={activity} />

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