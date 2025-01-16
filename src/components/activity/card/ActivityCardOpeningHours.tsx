import React, { useState } from 'react';
import { Activity } from '@/types/activity';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ActivityCardOpeningHoursProps {
  activity: Activity;
}

export const ActivityCardOpeningHours = ({ activity }: ActivityCardOpeningHoursProps) => {
  const [isOpeningHoursOpen, setIsOpeningHoursOpen] = useState(false);

  const formatOpeningHours = (openingHours: string) => {
    if (!openingHours || openingHours.trim() === '') return null;

    const entries = openingHours.split(' ');
    const formattedSchedule = [];
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.endsWith(':')) {
        const day = entry.slice(0, -1);
        const times = entries[i + 1];
        
        i++;
        
        formattedSchedule.push({
          days: day,
          hours: times === 'Geschlossen' ? 'Geschlossen' : times
        });
      }
    }

    return formattedSchedule;
  };

  const isCurrentlyOpen = () => {
    if (!activity.opening_hours) return null;

    const now = new Date();
    const currentDay = now.toLocaleDateString('de-DE', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    const isOpen = activity.opening_hours.split(' ').some((part, index, array) => {
      if (part.endsWith(':')) {
        const day = part.slice(0, -1);
        const times = array[index + 1];
        
        if (!times || times === 'Geschlossen') return false;
        
        const isDayIncluded = day.toLowerCase() === currentDay.toLowerCase();
        if (!isDayIncluded) return false;

        const [start, end] = times.split('-').map(t => t.trim());
        return currentTime >= start && currentTime <= end;
      }
      return false;
    });

    return isOpen;
  };

  const formattedHours = activity.opening_hours ? formatOpeningHours(activity.opening_hours) : null;
  const openStatus = isCurrentlyOpen();

  if (!activity.opening_hours || !formattedHours) return null;

  return (
    <Collapsible
      open={isOpeningHoursOpen}
      onOpenChange={setIsOpeningHoursOpen}
      className="space-y-2"
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
        {openStatus !== null && (
          <Badge 
            className={`ml-2 ${
              openStatus 
                ? "bg-[#F2FCE2] text-green-700 hover:bg-[#F2FCE2]" 
                : "bg-[#FFDEE2] text-red-700 hover:bg-[#FFDEE2]"
            }`}
          >
            {openStatus ? "Geöffnet" : "Geschlossen"}
          </Badge>
        )}
      </div>
      <CollapsibleContent className="pl-6 space-y-2">
        {formattedHours.map((schedule, index) => (
          <div 
            key={index} 
            className="text-sm text-white/90 grid grid-cols-[120px,1fr] gap-2 items-center border-b border-white/10 pb-2 last:border-0 last:pb-0"
          >
            <span className="font-medium">{schedule.days}:</span>
            <span className="text-right">{schedule.hours}</span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};