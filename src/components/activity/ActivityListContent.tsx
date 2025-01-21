import React from 'react';
import { Activity } from '@/types/activity';
import { ActivityCard } from './ActivityCard';

interface ActivityListContentProps {
  activities: Activity[];
  onSelect: (activity: Activity) => void;
  onClaim: (activityId: string) => void;
  onEdit?: (activity: Activity) => void;
  showClaimButton: boolean;
  onRefresh?: () => void;
  onDelete?: () => void;
}

const ActivityListContent = ({ 
  activities, 
  onSelect, 
  onClaim,
  onEdit,
  showClaimButton,
  onRefresh,
  onDelete
}: ActivityListContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onSelect={onSelect}
          onClaim={onClaim}
          showClaimButton={showClaimButton}
          onRefresh={onRefresh}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ActivityListContent;