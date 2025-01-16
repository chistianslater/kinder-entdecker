import React from 'react';

interface Schedule {
  days: string;
  hours: string;
}

interface ScheduleListProps {
  schedule: Schedule[];
}

export const ScheduleList = ({ schedule }: ScheduleListProps) => {
  return (
    <div className="pl-6 space-y-1">
      {schedule.map((item, index) => (
        <div 
          key={index} 
          className="text-sm text-white/90 flex items-start"
        >
          <span className="w-24 font-normal">{item.days}</span>
          <span className="font-normal">{item.hours}</span>
        </div>
      ))}
    </div>
  );
};