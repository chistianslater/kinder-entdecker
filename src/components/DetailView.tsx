import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { MapPin, Clock, Euro, Users, Tag, Phone, Mail, Globe, Building2, Ticket, Check, Navigation } from 'lucide-react';
import { Activity } from '@/types/activity';
import { Button } from '@/components/ui/button';
import { ActivityReviews } from './activity/ActivityReviews';

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
      <DrawerContent className="max-h-[95vh]">
        <div className="container max-w-2xl mx-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl font-bold text-primary">{activity.title}</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-8 space-y-6 overflow-y-auto">
            {activity.image_url && (
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img
                  src={activity.image_url}
                  alt={activity.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              {activity.is_business && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Building2 className="w-4 h-4 mr-1" />
                  Business
                </span>
              )}
              {activity.is_verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <Check className="w-4 h-4 mr-1" />
                  Verifiziert
                </span>
              )}
            </div>

            {activity.description && (
              <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Details</h3>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{activity.location}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleNavigate}
                    className="shrink-0"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigation
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{activity.opening_hours}</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                  <Euro className="w-5 h-5 text-primary" />
                  <span>{activity.price_range}</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{activity.age_range}</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                  <Tag className="w-5 h-5 text-primary" />
                  <span>{activity.type}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Links & Kontakt</h3>
              <div className="grid gap-3">
                {activity.website_url && (
                  <a 
                    href={activity.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-primary" />
                    <span>Website besuchen</span>
                  </a>
                )}
                {activity.ticket_url && (
                  <a 
                    href={activity.ticket_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                  >
                    <Ticket className="w-5 h-5 text-primary" />
                    <span>Tickets kaufen</span>
                  </a>
                )}
              </div>
            </div>

            <div className="pt-6 border-t">
              <ActivityReviews activity={activity} />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DetailView;