import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock, Euro, Users, Tag, Calendar, Building2, Check } from 'lucide-react';
import { Activity } from '@/types/activity';

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
  onClaim?: (activityId: string) => void;
  showClaimButton: boolean;
}

export const ActivityCard = ({ activity, onSelect, onClaim, showClaimButton }: ActivityCardProps) => {
  return (
    <Card 
      className="p-6 hover:shadow-soft transition-shadow cursor-pointer"
      onClick={() => onSelect(activity)}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <img 
          src={activity.image_url || '/placeholder.svg'} 
          alt={activity.title}
          className="w-full md:w-48 h-48 object-cover rounded-lg"
        />
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{activity.title}</h3>
                {activity.is_business && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Building2 className="w-3 h-3 mr-1" />
                    Business
                  </span>
                )}
                {activity.is_verified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" />
                    Verifiziert
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                {activity.location}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Euro className="w-4 h-4 text-primary" />
                {activity.price_range}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                {activity.opening_hours}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                {activity.age_range}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-primary" />
                {activity.type}
              </div>
            </div>
          </div>

          {showClaimButton && !activity.claimed_by && !activity.is_business && (
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onClaim?.(activity.id);
              }}
              className="flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Als Unternehmen beanspruchen
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};