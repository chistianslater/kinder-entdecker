import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Euro, Tag, Building2, Check } from 'lucide-react';
import { Activity } from '@/types/activity';
import WeatherInfo from './WeatherInfo';
import { Separator } from '@/components/ui/separator';

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
  onClaim?: (activityId: string) => void;
  showClaimButton: boolean;
}

export const ActivityCard = ({ activity, onSelect, onClaim, showClaimButton }: ActivityCardProps) => {
  const imageUrl = activity.image_url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b';

  return (
    <Card 
      className="bg-white hover:shadow-soft transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden border border-accent/10"
      onClick={() => onSelect(activity)}
    >
      <div className="w-full h-64 relative">
        <img
          src={imageUrl}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-2 right-2 bg-white/90 rounded-lg px-2 py-1">
          <WeatherInfo location={activity.location} />
        </div>

        <div className="absolute bottom-4 left-4 flex gap-2">
          {activity.is_business && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-white/90 text-[#94A684]">
              <Building2 className="w-3 h-3 mr-1" />
              Business
            </span>
          )}
          {activity.is_verified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-white/90 text-[#94A684]">
              <Check className="w-3 h-3 mr-1" />
              Verifiziert
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-2xl font-semibold text-primary mb-2">{activity.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{activity.description}</p>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{activity.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{activity.age_range}</span>
          </div>
          <div className="flex items-center gap-1">
            <Euro className="w-4 h-4" />
            <span>{activity.price_range}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            <span>{activity.type}</span>
          </div>
        </div>

        {showClaimButton && !activity.claimed_by && !activity.is_business && (
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onClaim?.(activity.id);
            }}
            className="w-full mt-4 bg-[#E4E4D0] hover:bg-[#AEC3AE] text-[#94A684] border-[#94A684] flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Als Unternehmen beanspruchen
          </Button>
        )}
      </div>
    </Card>
  );
};