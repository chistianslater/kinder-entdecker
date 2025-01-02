import React from 'react';
import { MapPin, Clock, Euro, Users, Tag, Navigation, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Activity } from '@/types/activity';
import { ImageGallery } from './ImageGallery';
import { Badge } from "@/components/ui/badge";

interface ActivityDetailsProps {
  activity: Activity;
}

export const ActivityDetails = ({ activity }: ActivityDetailsProps) => {
  const handleNavigate = () => {
    const encodedAddress = encodeURIComponent(activity.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        {activity.is_business && (
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1 rounded-2xl bg-black/30 backdrop-blur-md border border-white/40"
          >
            <Building2 className="w-4 h-4" />
            Unternehmensbeitrag
          </Badge>
        )}
      </div>

      <ImageGallery activity={activity} />

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
          <span>{activity.opening_hours || 'Not specified'}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
          <Euro className="w-5 h-5 text-primary" />
          <span>{activity.price_range || 'Not specified'}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
          <Users className="w-5 h-5 text-primary" />
          <span>{activity.age_range || 'Not specified'}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
          <Tag className="w-5 h-5 text-primary" />
          <span>{activity.type}</span>
        </div>
      </div>
    </div>
  );
};