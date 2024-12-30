import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock, Euro, Users, Tag, Building2, Check, TreePine } from 'lucide-react';
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
      className="bg-white hover:shadow-soft transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden border-2 border-accent/20"
      onClick={() => onSelect(activity)}
    >
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="relative">
          <img 
            src={activity.image_url || '/placeholder.svg'} 
            alt={activity.title}
            className="w-full md:w-48 h-48 object-cover rounded-xl"
          />
          {activity.type === 'outdoor' && (
            <div className="absolute top-3 right-3 bg-accent/90 p-2 rounded-full">
              <TreePine className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-primary">{activity.title}</h3>
                {activity.is_business && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-primary">
                    <Building2 className="w-3 h-3 mr-1" />
                    Business
                  </span>
                )}
                {activity.is_verified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/30 text-primary">
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
              <div className="flex items-center gap-2 text-sm text-primary">
                <MapPin className="w-4 h-4" />
                {activity.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Euro className="w-4 h-4" />
                {activity.price_range}
              </div>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Clock className="w-4 h-4" />
                {activity.opening_hours}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-primary">
                <Users className="w-4 h-4" />
                {activity.age_range}
              </div>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Tag className="w-4 h-4" />
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
              className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary border-accent"
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