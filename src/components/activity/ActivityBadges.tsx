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
      <div>
        {activity.is_business && (
          <Badge variant="secondary" className="flex items-center gap-1 rounded-md">
            <Building2 className="w-4 h-4" />
            Unternehmensbeitrag
          </Badge>
        )}
      </div>
      <div>
        {activity.is_verified && (
          <Badge variant="default" className="flex items-center rounded-md bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle2 className="w-4 h-4" />
          </Badge>
        )}
      </div>
    </div>
  );
};