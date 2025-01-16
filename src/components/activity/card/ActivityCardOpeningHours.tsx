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
    if (!openingHours) return null;

    const scheduleLines = openingHours.split('\n');
    const formattedSchedule = scheduleLines.map(line => {
      const [days, times] = line.split(':').map(s => s.trim());
      if (!times || times.toLowerCase() === 'geschlossen') {
        return { days, hours: 'Geschlossen' };
      }

      const formattedDays = days;
      const formattedHours = times.split(',').map(slot => {
        const [start, end] = slot.trim().split('-').map(t => t.trim());
        if (!start || !end) return null;
        const formatTime = (time: string) => time.includes(':') ? time : `${time}:00`;
        return `${formatTime(start)} - ${formatTime(end)} Uhr`;
      }).filter(Boolean).join(', ');

      return { days: formattedDays, hours: formattedHours };
    });

    return formattedSchedule;
  };

  const isCurrentlyOpen = () => {
    if (!activity.opening_hours) return null;

    const now = new Date();
    const currentDay = now.toLocaleDateString('de-DE', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    const isOpen = activity.opening_hours.toLowerCase().split('\n').some(schedule => {
      const [days, hours] = schedule.split(':').map(s => s.trim());
      if (!hours || hours === 'Geschlossen') return false;

      const isDayIncluded = days.toLowerCase().includes(currentDay.toLowerCase());
      if (!isDayIncluded) return false;

      const timeSlots = hours.split(',').map(slot => slot.trim());
      return timeSlots.some(slot => {
        const [openTime, closeTime] = slot.split('-').map(t => t.trim());
        return currentTime >= openTime && currentTime <= closeTime;
      });
    });

    return isOpen;
  };

  const formattedHours = activity.opening_hours ? formatOpeningHours(activity.opening_hours) : null;
  const openStatus = isCurrentlyOpen();

  if (!formattedHours) return null;

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
      <CollapsibleContent className="pl-6 space-y-0.5">
        {formattedHours.map((schedule, index) => (
          <div key={index} className="text-sm text-white whitespace-nowrap flex justify-between items-center w-full pr-2">
            <span className="font-medium min-w-[100px]">{schedule.days}:</span>
            <span className="ml-2">{schedule.hours}</span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};