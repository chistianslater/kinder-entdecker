import React from 'react';
import { Activity } from '@/types/activity';
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';

interface ActivityCardActionsProps {
  activity: Activity;
  onClaim?: (activityId: string) => void;
  onEdit?: (activity: Activity) => void;
  showClaimButton: boolean;
  isOwner: boolean;
  isAdmin: boolean;
}

export const ActivityCardActions = ({ 
  activity,
  onClaim,
  onEdit,
  showClaimButton,
  isOwner,
  isAdmin
}: ActivityCardActionsProps) => {
  return (
    <div className="p-4 pt-0 flex gap-2">
      {showClaimButton && onClaim && (
        <Button 
          variant="outline" 
          className="w-full rounded-md text-white border-white/20 hover:text-white hover:bg-white/10"
          onClick={() => onClaim(activity.id)}
        >
          Als Geschäft beanspruchen
        </Button>
      )}
      {(isOwner || isAdmin) && onEdit && (
        <Button 
          variant="outline" 
          className="w-full rounded-md text-white border-white/20 hover:text-white hover:bg-white/10"
          onClick={() => onEdit(activity)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Bearbeiten
        </Button>
      )}
    </div>
  );
};