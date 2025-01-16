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
      const [days, hours] = line.split(':').map(s => s.trim());
      if (!hours) return null;

      const formattedDays = days.split(',').map(day => 
        day.trim().split('-').map(d => 
          d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()
        ).join('-')
      ).join(', ');

      return { days: formattedDays, hours: hours.trim() };
    }).filter(Boolean);

    return formattedSchedule;
  };

  const isCurrentlyOpen = () => {
    if (!activity.opening_hours) return null;

    const now = new Date();
    const currentDay = now.toLocaleDateString('de-DE', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    const isOpen = activity.opening_hours.toLowerCase().split('\n').some(schedule => {
      const [days, hours] = schedule.split(':').map(s => s.trim());
      if (!hours) return false;

      const isDayIncluded = days.split(',').some(dayRange => {
        const [start, end] = dayRange.split('-').map(d => d.trim());
        const daysOfWeek = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'];
        const startIdx = daysOfWeek.indexOf(start.toLowerCase());
        const endIdx = end ? daysOfWeek.indexOf(end.toLowerCase()) : startIdx;
        const currentIdx = daysOfWeek.indexOf(currentDay);
        return currentIdx >= startIdx && currentIdx <= endIdx;
      });

      if (!isDayIncluded) return false;

      const [openTime, closeTime] = hours.split('-').map(t => t.trim());
      return currentTime >= openTime && currentTime <= closeTime;
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