import { Activity } from '@/types/activity';
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2 } from 'lucide-react';

interface ActivityBadgesProps {
  activity: Activity;
  className?: string;
}

export const ActivityBadges = ({ activity, className }: ActivityBadgesProps) => {
  return (
    <div className={`flex items-center justify-between w-full ${className || ''}`}>
      <div className="px-4">
        {activity.is_business && (
          <Badge variant="secondary" className="flex items-center gap-1 rounded-md">
            <Building2 className="w-4 h-4" />
            Unternehmensbeitrag
          </Badge>
        )}
      </div>
      <div className="px-4">
        {activity.is_verified && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
        )}
      </div>
    </div>
  );
};