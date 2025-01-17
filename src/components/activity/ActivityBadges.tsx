import { Activity } from '@/types/activity';
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, Clock } from 'lucide-react';

interface ActivityBadgesProps {
  activity: Activity;
  className?: string;
}

export const ActivityBadges = ({ activity, className }: ActivityBadgesProps) => {
  return (
    <div className={`flex items-center justify-between w-full z-[5] ${className || ''}`}>
      <div className="flex gap-2">
        {activity.is_business && (
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1 rounded-2xl ml-2 bg-black/30 backdrop-blur-md border border-white/40"
          >
            <Building2 className="w-4 h-4" />
            Unternehmensbeitrag
          </Badge>
        )}
        {activity.approved_at ? (
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1 rounded-2xl bg-green-500/30 backdrop-blur-md border border-green-500/40"
          >
            <CheckCircle2 className="w-4 h-4" />
            Genehmigt
          </Badge>
        ) : (
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1 rounded-2xl bg-yellow-500/30 backdrop-blur-md border border-yellow-500/40"
          >
            <Clock className="w-4 h-4" />
            Ausstehend
          </Badge>
        )}
      </div>
    </div>
  );
};