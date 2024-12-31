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
  onClaim: (activityId: string) => void;
  showClaimButton: boolean;
}

export const ActivityCard = ({ activity, onSelect, onClaim, showClaimButton }: ActivityCardProps) => {
  const imageUrl = activity.image_url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b';

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(activity)}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={activity.title}
          className="w-full h-48 object-cover"
        />
        {activity.is_verified && (
          <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Check className="w-3 h-3" />
            Autorisiert
          </div>
        )}
        {activity.is_business && (
          <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            Unternehmensbeitrag
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-primary mb-1">{activity.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{activity.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>

          {activity.age_range && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 shrink-0" />
              <span>{activity.age_range}</span>
            </div>
          )}

          {activity.price_range && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Euro className="w-4 h-4 shrink-0" />
              <span>{activity.price_range}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="w-4 h-4 shrink-0" />
            <span>{activity.type}</span>
          </div>
        </div>

        <Separator />

        <div>
          <WeatherInfo location={activity.location} />
        </div>

        {showClaimButton && !activity.claimed_by && !activity.is_business && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={(e) => {
              e.stopPropagation();
              onClaim(activity.id);
            }}
          >
            Claim Business
          </Button>
        )}
      </div>
    </Card>
  );
};