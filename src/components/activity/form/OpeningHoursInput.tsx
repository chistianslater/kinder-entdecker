import React from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimeSlot {
  open: string;
  close: string;
}

interface DaySchedule {
  day: string;
  isClosed: boolean;
  slots: TimeSlot[];
}

interface OpeningHoursInputProps {
  value: string;
  onChange: (value: string) => void;
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

export function OpeningHoursInput({ value, onChange }: OpeningHoursInputProps) {
  const [schedule, setSchedule] = React.useState<DaySchedule[]>(() => {
    try {
      // Try to parse existing value
      const lines = value.split('\n');
      return DAYS.map(day => {
        const dayLine = lines.find(line => line.startsWith(day));
        if (!dayLine || dayLine.includes('Geschlossen')) {
          return {
            day,
            isClosed: true,
            slots: [{ open: '08:00', close: '17:00' }]
          };
        }
        const timePart = dayLine.split(':')[1];
        const timeSlots = timePart.split(',').map(slot => {
          const [open, close] = slot.trim().split('-').map(t => t.trim());
          return { open, close };
        });
        return {
          day,
          isClosed: false,
          slots: timeSlots
        };
      });
    } catch {
      // Default schedule if parsing fails
      return DAYS.map(day => ({
        day,
        isClosed: true,
        slots: [{ open: '08:00', close: '17:00' }]
      }));
    }
  });

  const updateSchedule = (newSchedule: DaySchedule[]) => {
    setSchedule(newSchedule);
    // Convert schedule to string format
    const formattedSchedule = newSchedule
      .map(day => {
        if (day.isClosed) {
          return `${day.day}: Geschlossen`;
        }
        const slots = day.slots
          .map(slot => `${slot.open}-${slot.close}`)
          .join(', ');
        return `${day.day}: ${slots}`;
      })
      .join('\n');
    onChange(formattedSchedule);
  };

  const toggleDay = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].isClosed = !newSchedule[dayIndex].isClosed;
    updateSchedule(newSchedule);
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots.push({ open: '08:00', close: '17:00' });
    updateSchedule(newSchedule);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots.splice(slotIndex, 1);
    updateSchedule(newSchedule);
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'open' | 'close', value: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots[slotIndex][field] = value;
    updateSchedule(newSchedule);
  };

  return (
    <div className="space-y-4">
      {schedule.map((day, dayIndex) => (
        <div key={day.day} className="space-y-3 p-4 rounded-lg bg-accent/10">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={!day.isClosed}
              onCheckedChange={() => toggleDay(dayIndex)}
              className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <Label className="text-white text-base">{day.day}</Label>
          </div>

          {!day.isClosed && (
            <div className="space-y-3 pl-6">
              {day.slots.map((slot, slotIndex) => (
                <div key={slotIndex} className="flex items-center gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm text-white/60">Öffnet um</Label>
                    <Input
                      type="time"
                      value={slot.open}
                      onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'open', e.target.value)}
                      className="w-32 bg-accent border-accent text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm text-white/60">Schließt um</Label>
                    <Input
                      type="time"
                      value={slot.close}
                      onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'close', e.target.value)}
                      className="w-32 bg-accent border-accent text-white"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    {slotIndex > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                        className="mb-1.5 text-white hover:text-white/80 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {slotIndex === day.slots.length - 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => addTimeSlot(dayIndex)}
                        className="mb-1.5 text-white hover:text-white/80"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}