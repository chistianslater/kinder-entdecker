import React from 'react';
import { Activity } from '@/types/activity';
import { ActivityCard } from './ActivityCard';

interface ActivityListContentProps {
  activities: Activity[];
  onSelect: (activity: Activity) => void;
  onClaim: (activityId: string) => void;
  showClaimButton: boolean;
}

const ActivityListContent = ({ 
  activities, 
  onSelect, 
  onClaim, 
  showClaimButton 
}: ActivityListContentProps) => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onSelect={onSelect}
          onClaim={onClaim}
          showClaimButton={showClaimButton}
        />
      ))}
    </div>
  );
};

export default ActivityListContent;