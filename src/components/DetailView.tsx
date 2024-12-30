import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { X } from 'lucide-react';
import { Activity } from '@/types/activity';
import { Button } from '@/components/ui/button';
import { ActivityReviews } from './activity/ActivityReviews';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActivityBadges } from './activity/ActivityBadges';
import { ActivityDetails } from './activity/ActivityDetails';
import { ActivityLinks } from './activity/ActivityLinks';

interface DetailViewProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailView = ({ activity, isOpen, onClose }: DetailViewProps) => {
  if (!activity) return null;

  const handleNavigate = () => {
    try {
      const encodedAddress = encodeURIComponent(activity.location);
      const navigationUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(navigationUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <ScrollArea className="h-[95vh]">
          <div className="container max-w-2xl mx-auto">
            <DrawerHeader className="text-left relative">
              <DrawerTitle className="text-2xl font-bold text-primary pr-12">{activity.title}</DrawerTitle>
              <DrawerClose className="absolute right-4 top-4">
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </DrawerHeader>

            <div className="px-4 pb-8 space-y-6">
              {activity.image_url && (
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <img
                    src={activity.image_url}
                    alt={activity.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              <ActivityBadges 
                isBusiness={activity.is_business} 
                isVerified={activity.is_verified} 
              />

              {activity.description && (
                <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
              )}

              <ActivityDetails
                location={activity.location}
                openingHours={activity.opening_hours}
                priceRange={activity.price_range}
                ageRange={activity.age_range}
                type={activity.type}
                onNavigate={handleNavigate}
              />

              <ActivityLinks
                websiteUrl={activity.website_url}
                ticketUrl={activity.ticket_url}
              />

              <div className="pt-6 border-t">
                <ActivityReviews activity={activity} />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default DetailView;