import React from 'react';
import { MapPin, Clock, Euro, Users, Tag, Navigation, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Activity } from '@/types/activity';
import { ImageGallery } from './ImageGallery';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
      <div className="grid gap-6">
        <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-white">{activity.location}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNavigate}
            className="shrink-0 text-white border-white/20 hover:bg-white/10"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Navigation
          </Button>
        </div>

        <Separator className="bg-accent/20" />

        <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-white">{activity.opening_hours || 'Nicht angegeben'}</span>
        </div>

        <Separator className="bg-accent/20" />

        <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg">
          <Euro className="w-5 h-5 text-primary" />
          <span className="text-white">{activity.price_range || 'Nicht angegeben'}</span>
        </div>

        <Separator className="bg-accent/20" />

        <div className="flex flex-col gap-4 p-4 bg-accent/10 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-white">Altersgruppe</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activity.age_range?.map((age) => (
              <div
                key={age}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-[#1E2128] text-white"
              >
                <Users className="h-4 w-4" />
                {age === 'all' ? 'Alle Jahre' : `${age} Jahre`}
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-accent/20" />

        <div className="flex flex-col gap-4 p-4 bg-accent/10 rounded-lg">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-primary" />
            <span className="text-white">Aktivitätstyp</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(activity.type) ? activity.type.map((type) => (
              <div
                key={type}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-[#1E2128] text-white"
              >
                <Tag className="h-4 w-4" />
                {type}
              </div>
            )) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-[#1E2128] text-white">
                <Tag className="h-4 w-4" />
                {activity.type}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};