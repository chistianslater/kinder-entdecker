import { Activity } from '@/types/activity';
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, Clock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActivityBadgesProps {
  activity: Activity;
  className?: string;
}

export const ActivityBadges = ({ activity, className }: ActivityBadgesProps) => {
  return (
    <div className={`flex items-center justify-between w-full z-[5] ${className || ''}`}>
      <div className="flex gap-2">
        {activity.is_business && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="secondary" 
                  className="flex items-center justify-center w-8 h-8 p-0 rounded-full bg-black/30 backdrop-blur-md border border-white/40"
                >
                  <Building2 className="w-4 h-4" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-black/90 text-white border-white/10"
              >
                <p>Business Activity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {activity.approved_at ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="secondary" 
                  className="flex items-center justify-center w-8 h-8 p-0 rounded-full bg-green-500/30 backdrop-blur-md border border-green-500/40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-black/90 text-white border-white/10"
              >
                <p>Approved Activity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="secondary" 
                  className="flex items-center justify-center w-8 h-8 p-0 rounded-full bg-yellow-500/30 backdrop-blur-md border border-yellow-500/40"
                >
                  <Clock className="w-4 h-4" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-black/90 text-white border-white/10"
              >
                <p>Pending Approval</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};