import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

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

const formatTimeValue = (time: string): string => {
  if (!time) return '00:00';
  return time.includes(':') ? time : `${time}:00`;
};

const parseTimeSlots = (timePart: string): TimeSlot[] => {
  if (timePart.toLowerCase() === 'geschlossen') {
    return [];
  }
  return timePart.split(',').map(slot => {
    const [open, close] = slot.trim().split('-').map(t => t.trim());
    return { open: formatTimeValue(open), close: formatTimeValue(close) };
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

  React.useEffect(() => {
    setSchedule(parseOpeningHours(value));
  }, [value]);

  const updateSchedule = (newSchedule: DaySchedule[]) => {
    setSchedule(newSchedule);
    onChange(formatSchedule(newSchedule));
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots.push({ open: '00:00', close: '00:00' });
    updateSchedule(newSchedule);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots.splice(slotIndex, 1);
    updateSchedule(newSchedule);
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'open' | 'close', value: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots[slotIndex][field] = formatTimeValue(value);
    updateSchedule(newSchedule);
  };

  return (
    <div className="space-y-4 bg-accent rounded-lg p-4">
      {schedule.map((daySchedule, dayIndex) => (
        <div key={daySchedule.day} className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={daySchedule.slots.length > 0}
              onCheckedChange={(checked) => {
                const newSchedule = [...schedule];
                newSchedule[dayIndex].slots = checked ? [{ open: '00:00', close: '00:00' }] : [];
                updateSchedule(newSchedule);
              }}
              className="border-white/20"
            />
            <span className="text-lg text-white">{daySchedule.day}</span>
          </div>
          {daySchedule.slots.length > 0 && (
            <div className="space-y-4 pl-8">
              {daySchedule.slots.map((slot, slotIndex) => (
                <div key={slotIndex} className="space-y-2">
                  <div className="grid grid-cols-[1fr,auto,1fr,auto] gap-3 items-center">
                    <div className="space-y-1">
                      <span className="text-sm text-white/60">Öffnet um</span>
                      <Input
                        type="time"
                        value={slot.open}
                        onChange={(e) =>
                          updateTimeSlot(dayIndex, slotIndex, 'open', e.target.value)
                        }
                        className="bg-background border-white/10"
                      />
                    </div>
                    <span className="text-white mt-6">-</span>
                    <div className="space-y-1">
                      <span className="text-sm text-white/60">Schließt um</span>
                      <Input
                        type="time"
                        value={slot.close}
                        onChange={(e) =>
                          updateTimeSlot(dayIndex, slotIndex, 'close', e.target.value)
                        }
                        className="bg-background border-white/10"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                      className="mt-6 text-white hover:text-white hover:bg-white/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addTimeSlot(dayIndex)}
                className="text-white hover:text-white hover:bg-white/10 w-full"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};