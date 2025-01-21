import React from 'react';
import { Activity } from '@/types/activity';
import { Card, CardContent } from "@/components/ui/card";
import { ActivityBadges } from './ActivityBadges';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { ActivityCardHeader } from './card/ActivityCardHeader';
import { ActivityCardDetails } from './card/ActivityCardDetails';
import { ActivityCardOpeningHours } from './card/ActivityCardOpeningHours';
import { ActivityCardActions } from './ActivityCardActions';
import { useActivityImage } from '@/hooks/useActivityImage';
import { useActivityRating } from '@/hooks/useActivityRating';
import { useActivityOwnership } from '@/hooks/useActivityOwnership';

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
  onClaim?: (activityId: string) => void;
  showClaimButton?: boolean;
  onRefresh?: () => void;
  onDelete?: () => void;
}

export const ActivityCard = ({ 
  activity, 
  onSelect, 
  onClaim,
  showClaimButton = false,
  onRefresh,
  onDelete
}: ActivityCardProps) => {
  const displayImage = useActivityImage(activity.id, activity.image_url);
  const { averageRating, reviewCount } = useActivityRating(activity.id);
  const isOwner = useActivityOwnership(activity.created_by);
  const { isAdmin } = useIsAdmin();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-3xl bg-black/5 backdrop-blur-md border border-white/10">
      <div className="relative">
        <ActivityBadges activity={activity} className="absolute top-2 left-2 right-2 z-10" />
        <div 
          className="h-48 bg-cover bg-center cursor-pointer rounded-t-2xl" 
          style={{ 
            backgroundImage: displayImage ? `url(${displayImage})` : undefined,
            backgroundColor: !displayImage ? 'rgba(0,0,0,0.1)' : undefined
          }}
          onClick={() => onSelect(activity)}
        />
      </div>
      <CardContent className="p-4">
        <ActivityCardHeader 
          activity={activity}
          averageRating={averageRating}
          reviewCount={reviewCount}
          onSelect={onSelect}
        />
        <ActivityCardDetails activity={activity} />
        <ActivityCardOpeningHours activity={activity} />
      </CardContent>
      <ActivityCardActions 
        activity={activity}
        onClaim={onClaim}
        showClaimButton={showClaimButton}
        isOwner={isOwner}
        isAdmin={isAdmin}
        onApprove={onRefresh}
        onDelete={onDelete}
      />
    </Card>
  );
};