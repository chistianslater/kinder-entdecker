import React, { useState } from 'react';
import { Activity } from '@/types/activity';
import { Button } from "@/components/ui/button";
import { Clock, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatOpeningHours, isCurrentlyOpen } from '@/utils/openingHoursFormatter';
import { OpeningStatusBadge } from './opening-hours/OpeningStatusBadge';
import { ScheduleList } from './opening-hours/ScheduleList';

interface ActivityCardOpeningHoursProps {
  activity: Activity;
}

export const ActivityCardOpeningHours = ({ activity }: ActivityCardOpeningHoursProps) => {
  const [isOpeningHoursOpen, setIsOpeningHoursOpen] = useState(false);
  const formattedHours = activity.opening_hours ? formatOpeningHours(activity.opening_hours) : null;
  const openStatus = activity.opening_hours ? isCurrentlyOpen(activity.opening_hours) : null;

  if (!activity.opening_hours || !formattedHours) return null;

  return (
    <Collapsible
      open={isOpeningHoursOpen}
      onOpenChange={setIsOpeningHoursOpen}
      className="space-y-2 pt-4"
    >
      <div className="flex items-center justify-between text-sm text-white/90">
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-0 h-auto hover:bg-transparent hover:text-white/80 flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-white" />
            <span className="font-medium">Öffnungszeiten</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpeningHoursOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <OpeningStatusBadge isOpen={openStatus} openingHours={activity.opening_hours} />
      </div>
      <CollapsibleContent>
        {activity.opening_hours.toLowerCase() === '24/7' ? (
          <div className="text-sm text-white/70 pl-6">
            Immer geöffnet (24/7)
          </div>
        ) : (
          <ScheduleList schedule={formattedHours} />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};