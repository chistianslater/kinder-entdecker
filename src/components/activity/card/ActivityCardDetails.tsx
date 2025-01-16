import React from 'react';
import { Activity } from '@/types/activity';
import { Badge } from "@/components/ui/badge";
import { MapPin, TreePine, Baby, Euro } from 'lucide-react';

interface ActivityCardDetailsProps {
  activity: Activity;
}

export const ActivityCardDetails = ({ activity }: ActivityCardDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center text-sm text-white/90">
        <MapPin className="w-4 h-4 mr-2 text-white" />
        {activity.location}
      </div>

      <div className="flex items-center text-sm text-white/90">
        <TreePine className="w-4 h-4 mr-2 text-white" />
        <div className="flex flex-wrap gap-1">
          {activity.type.map((type, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="rounded-md bg-white/10 text-white"
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {activity.age_range && activity.age_range.length > 0 && (
        <div className="flex items-start text-sm text-white/90">
          <Baby className="w-4 h-4 mr-2 mt-1 text-white shrink-0" />
          <div className="flex flex-wrap gap-1">
            {activity.age_range.map((range, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="rounded-md border-white/20 text-white"
              >
                {range} Jahre
              </Badge>
            ))}
          </div>
        </div>
      )}

      {activity.price_range && (
        <div className="flex items-center text-sm text-white/90">
          <Euro className="w-4 h-4 mr-2 text-white" />
          <Badge variant="outline" className="rounded-md border-white/20 text-white">
            {activity.price_range}
          </Badge>
        </div>
      )}
    </div>
  );
};