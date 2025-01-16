import React from 'react';
import { Activity } from '@/types/activity';
import { TreePine } from 'lucide-react';

interface ActivityCardHeaderProps {
  activity: Activity;
  averageRating: number | null;
  reviewCount: number;
  onSelect: (activity: Activity) => void;
}

export const ActivityCardHeader = ({ 
  activity, 
  averageRating, 
  reviewCount,
  onSelect 
}: ActivityCardHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <h3 
        className="text-lg font-semibold cursor-pointer hover:text-primary text-white"
        onClick={() => onSelect(activity)}
      >
        {activity.title}
      </h3>
      {averageRating !== null && (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-white">{averageRating.toFixed(1)}</span>
          <TreePine className="w-4 h-4 fill-primary text-primary" />
          <span className="text-sm text-white/80">({reviewCount})</span>
        </div>
      )}
    </div>
  );
};