import React from 'react';
import { Activity } from '@/types/activity';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Baby, Euro, MapPin, Clock, TreePine } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ActivityBadges } from './ActivityBadges';

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
  onClaim?: (activityId: string) => void;
  showClaimButton?: boolean;
}

export const ActivityCard = ({ 
  activity, 
  onSelect, 
  onClaim,
  showClaimButton = false 
}: ActivityCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div 
        className="h-48 bg-cover bg-center cursor-pointer" 
        style={{ 
          backgroundImage: activity.image_url 
            ? `url(${activity.image_url})` 
            : 'url(/placeholder.svg)' 
        }}
        onClick={() => onSelect(activity)}
      />
      <CardContent className="p-4">
        <h3 
          className="text-lg font-semibold mb-2 cursor-pointer hover:text-primary"
          onClick={() => onSelect(activity)}
        >
          {activity.title}
        </h3>

        <ActivityBadges activity={activity} className="mb-4" />
        
        <div className="space-y-2">
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {activity.location}
          </div>

          {/* Activity Type */}
          <div className="flex items-center text-sm text-gray-600">
            <TreePine className="w-4 h-4 mr-2" />
            <Badge variant="secondary">{activity.type}</Badge>
          </div>

          {/* Age Range */}
          {activity.age_range && (
            <div className="flex items-center text-sm text-gray-600">
              <Baby className="w-4 h-4 mr-2" />
              <Badge variant="outline">{activity.age_range} Jahre</Badge>
            </div>
          )}

          {/* Price Range */}
          {activity.price_range && (
            <div className="flex items-center text-sm text-gray-600">
              <Euro className="w-4 h-4 mr-2" />
              <Badge variant="outline">{activity.price_range}</Badge>
            </div>
          )}

          {/* Opening Hours */}
          {activity.opening_hours && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {activity.opening_hours}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {showClaimButton && onClaim && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onClaim(activity.id)}
          >
            Als Geschäft beanspruchen
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};