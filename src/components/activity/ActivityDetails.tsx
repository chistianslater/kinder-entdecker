import React from 'react';
import { MapPin, Clock, Euro, Users, Tag, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityDetailsProps {
  location: string;
  openingHours: string;
  priceRange: string;
  ageRange: string;
  type: string;
  onNavigate: () => void;
}

export const ActivityDetails = ({
  location,
  openingHours,
  priceRange,
  ageRange,
  type,
  onNavigate,
}: ActivityDetailsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary">Details</h3>
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <span>{location}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onNavigate}
            className="shrink-0"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Navigation
          </Button>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
          <Clock className="w-5 h-5 text-primary" />
          <span>{openingHours}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
          <Euro className="w-5 h-5 text-primary" />
          <span>{priceRange}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
          <Users className="w-5 h-5 text-primary" />
          <span>{ageRange}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
          <Tag className="w-5 h-5 text-primary" />
          <span>{type}</span>
        </div>
      </div>
    </div>
  );
};