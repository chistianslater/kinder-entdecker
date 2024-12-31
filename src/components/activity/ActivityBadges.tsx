import React from 'react';
import { Building2, Check } from 'lucide-react';
import { Activity } from '@/types/activity';

interface ActivityBadgesProps {
  activity: Activity;
  className?: string;
}

export const ActivityBadges = ({ activity, className }: ActivityBadgesProps) => {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      {activity.is_business && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <Building2 className="w-4 h-4 mr-1" />
          Business
        </span>
      )}
      {activity.is_verified && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <Check className="w-4 h-4 mr-1" />
          Verifiziert
        </span>
      )}
    </div>
  );
};