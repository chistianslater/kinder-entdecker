import React, { useState } from 'react';
import { Activity } from '@/types/activity';
import { Button } from "@/components/ui/button";
import { Clock, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ActivityCardOpeningHoursProps {
  activity: Activity;
}

export const ActivityCardOpeningHours = ({ activity }: ActivityCardOpeningHoursProps) => {
  const [isOpeningHoursOpen, setIsOpeningHoursOpen] = useState(false);

  const formatOpeningHours = (openingHours: string) => {
    if (!openingHours || openingHours.trim() === '') return null;

    // Split by spaces and filter out empty strings
    const parts = openingHours.split(/\s+/).filter(part => part);
    const formattedSchedule = [];
    
    for (let i = 0; i < parts.length; i++) {
      const day = parts[i].replace(':', ''); // Remove any colons from day names
      const hours = parts[i + 1];
      
      if (hours) {
        formattedSchedule.push({
          days: day,
          hours: hours
        });
        i++; // Skip the next part since we used it as hours
      }
    }

    return formattedSchedule;
  };

  const isCurrentlyOpen = () => {
    if (!activity.opening_hours) return null;

    const now = new Date();
    const currentDay = now.toLocaleDateString('de-DE', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    const parts = activity.opening_hours.split(/\s+/).filter(part => part);
    
    for (let i = 0; i < parts.length; i += 2) {
      const day = parts[i].replace(':', '');
      const hours = parts[i + 1];
      
      if (day.toLowerCase() === currentDay.toLowerCase()) {
        if (hours === 'Geschlossen') return false;
        
        const [start, end] = hours.split('-');
        return currentTime >= start && currentTime <= end;
      }
    }

    return false;
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
          <div className={`ml-2 px-2 py-1 rounded-md text-xs font-medium ${
            openStatus 
              ? "bg-[#F2FCE2] text-green-700" 
              : "bg-[#FFDEE2] text-red-700"
          }`}>
            {openStatus ? "Geöffnet" : "Geschlossen"}
          </div>
        )}
      </div>
      <CollapsibleContent className="pl-6 space-y-1">
        {formattedHours.map((schedule, index) => (
          <div 
            key={index} 
            className="text-base text-white/90 flex items-start"
          >
            <span className="w-32 font-normal">{schedule.days}</span>
            <span className="font-normal">{schedule.hours}</span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};