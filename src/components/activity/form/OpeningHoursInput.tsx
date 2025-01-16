import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSlot {
  open: string;
  close: string;
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

const DAYS = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag'
];

const MAX_SLOTS_PER_DAY = 2;

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(timeString);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

const parseTimeSlots = (timePart: string): TimeSlot[] => {
  if (timePart.toLowerCase() === 'geschlossen') {
    return [];
  }
  return timePart.split(',').slice(0, MAX_SLOTS_PER_DAY).map(slot => {
    const [open, close] = slot.trim().split('-').map(t => t.trim());
    return { 
      open: open || '09:00', 
      close: close || '17:00' 
    };
  });
};

const parseOpeningHours = (value: string): DaySchedule[] => {
  if (!value) {
    return DAYS.map(day => ({ day, slots: [] }));
  }

  const scheduleMap = new Map(
    DAYS.map(day => [day, { day, slots: [] as TimeSlot[] }])
  );

  value.split('\n').forEach(line => {
    const [days, times] = line.split(':').map(part => part.trim());
    if (!times) return;

    const timeSlots = parseTimeSlots(times);
    days.split(',').forEach(day => {
      const trimmedDay = day.trim();
      const schedule = scheduleMap.get(trimmedDay);
      if (schedule) {
        schedule.slots = timeSlots;
      }
    });
  });

  return Array.from(scheduleMap.values());
};

const formatSchedule = (schedule: DaySchedule[]): string => {
  return schedule
    .map(({ day, slots }) => {
      if (slots.length === 0) {
        return `${day}: Geschlossen`;
      }
      const timeRanges = slots
        .map(slot => `${slot.open}-${slot.close}`)
        .join(', ');
      return `${day}: ${timeRanges}`;
    })
    .join('\n');
};

interface OpeningHoursInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const OpeningHoursInput = ({ value, onChange }: OpeningHoursInputProps) => {
  const [schedule, setSchedule] = React.useState<DaySchedule[]>(() =>
    parseOpeningHours(value)
  );

  // Only update schedule when value prop changes
  React.useEffect(() => {
    const newSchedule = parseOpeningHours(value);
    setSchedule(newSchedule);
  }, [value]);

  const updateSchedule = React.useCallback((newSchedule: DaySchedule[]) => {
    const formattedValue = formatSchedule(newSchedule);
    onChange(formattedValue);
  }, [onChange]);

  const addTimeSlot = React.useCallback((dayIndex: number) => {
    const newSchedule = [...schedule];
    if (newSchedule[dayIndex].slots.length < MAX_SLOTS_PER_DAY) {
      newSchedule[dayIndex].slots.push({ open: '09:00', close: '17:00' });
      updateSchedule(newSchedule);
    }
  }, [schedule, updateSchedule]);

  const removeTimeSlot = React.useCallback((dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots.splice(slotIndex, 1);
    updateSchedule(newSchedule);
  }, [schedule, updateSchedule]);

  const updateTimeSlot = React.useCallback((dayIndex: number, slotIndex: number, field: 'open' | 'close', value: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots[slotIndex][field] = value;
    updateSchedule(newSchedule);
  }, [schedule, updateSchedule]);

  const handleDayToggle = React.useCallback((dayIndex: number, checked: boolean) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots = checked ? [{ open: '09:00', close: '17:00' }] : [];
    updateSchedule(newSchedule);
  }, [schedule, updateSchedule]);

  return (
    <div className="space-y-4 bg-accent rounded-lg p-4">
      {schedule.map((daySchedule, dayIndex) => (
        <div key={daySchedule.day} className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={daySchedule.slots.length > 0}
              onCheckedChange={(checked) => handleDayToggle(dayIndex, checked as boolean)}
              className="border-white/20"
            />
            <span className="text-base text-white">{daySchedule.day}</span>
          </div>
          {daySchedule.slots.length > 0 && (
            <div className="space-y-4 pl-8">
              {daySchedule.slots.map((slot, slotIndex) => (
                <div key={slotIndex} className="space-y-2">
                  <div className="grid grid-cols-[1fr,auto,1fr,auto] gap-3 items-center">
                    <div className="space-y-1">
                      <span className="text-xs text-white/60">Öffnet um</span>
                      <Select
                        value={slot.open}
                        onValueChange={(value) => updateTimeSlot(dayIndex, slotIndex, 'open', value)}
                      >
                        <SelectTrigger className="bg-background border-white/10 text-white">
                          <SelectValue placeholder="Öffnungszeit" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-accent/20">
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem 
                              key={time} 
                              value={time}
                              className="text-white focus:bg-accent focus:text-white"
                            >
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <span className="text-sm text-white mt-6">-</span>
                    <div className="space-y-1">
                      <span className="text-xs text-white/60">Schließt um</span>
                      <Select
                        value={slot.close}
                        onValueChange={(value) => updateTimeSlot(dayIndex, slotIndex, 'close', value)}
                      >
                        <SelectTrigger className="bg-background border-white/10 text-white">
                          <SelectValue placeholder="Schließzeit" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-accent/20">
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem 
                              key={time} 
                              value={time}
                              className="text-white focus:bg-accent focus:text-white"
                            >
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                      className="mt-6 text-white hover:text-white hover:bg-white/10"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              ))}
              {daySchedule.slots.length < MAX_SLOTS_PER_DAY && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addTimeSlot(dayIndex)}
                  className="text-white hover:text-white hover:bg-white/10 w-full"
                >
                  <Plus className="w-4 h-4 text-white" />
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};