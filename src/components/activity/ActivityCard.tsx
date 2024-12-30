import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Euro, Clock, Tag, Building2, Check, TreePine } from 'lucide-react';
import { Activity } from '@/types/activity';
import WeatherInfo from './WeatherInfo';

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
  onClaim?: (activityId: string) => void;
  showClaimButton: boolean;
}

export const ActivityCard = ({ activity, onSelect, onClaim, showClaimButton }: ActivityCardProps) => {
  return (
    <Card 
      className="bg-white hover:shadow-soft transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden border border-accent/10"
      onClick={() => onSelect(activity)}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold text-[#94A684]">{activity.title}</h3>
            <div className="flex gap-2">
              {activity.is_business && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#E4E4D0] text-[#94A684]">
                  <Building2 className="w-4 h-4 mr-1" />
                  Business
                </span>
              )}
              {activity.is_verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F5F5F5] text-[#94A684]">
                  <Check className="w-4 h-4 mr-1" />
                  Verifiziert
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-600">{activity.description}</p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#94A684]">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{activity.location}</span>
            </div>
            
            <div className="bg-[#F5F5F5] p-3 rounded-xl">
              <WeatherInfo location={activity.location} />
            </div>

            <div className="flex items-center gap-2 text-[#94A684]">
              <Euro className="w-5 h-5" />
              <span className="text-lg">{activity.price_range}</span>
            </div>

            <div className="flex items-center gap-2 text-[#94A684]">
              <Clock className="w-5 h-5" />
              <span className="text-lg">{activity.opening_hours}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#94A684]">
              <Users className="w-5 h-5" />
              <span className="text-lg">{activity.age_range}</span>
            </div>

            <div className="flex items-center gap-2 text-[#94A684]">
              <Tag className="w-5 h-5" />
              <span className="text-lg">{activity.type}</span>
            </div>
          </div>
        </div>

        {/* Claim Button */}
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