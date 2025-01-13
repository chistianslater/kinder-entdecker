import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus } from 'lucide-react';

interface TimeSlot {
  open: string;
  close: string;
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

interface OpeningHoursInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function OpeningHoursInput({ value, onChange }: OpeningHoursInputProps) {
  const [schedule, setSchedule] = React.useState<DaySchedule[]>(() => {
    try {
      // Try to parse existing value
      const lines = value.split('\n');
      return lines.map(line => {
        const [dayPart, timePart] = line.split(':').map(s => s.trim());
        const [open, close] = timePart ? timePart.split('-').map(t => t.trim()) : ['09:00', '17:00'];
        return {
          day: dayPart || 'Montag',
          slots: [{ open, close }]
        };
      });
    } catch {
      // Default schedule if parsing fails
      return [
        { day: 'Montag', slots: [{ open: '09:00', close: '17:00' }] },
        { day: 'Dienstag', slots: [{ open: '09:00', close: '17:00' }] },
        { day: 'Mittwoch', slots: [{ open: '09:00', close: '17:00' }] },
        { day: 'Donnerstag', slots: [{ open: '09:00', close: '17:00' }] },
        { day: 'Freitag', slots: [{ open: '09:00', close: '17:00' }] },
        { day: 'Samstag', slots: [{ open: '10:00', close: '16:00' }] },
        { day: 'Sonntag', slots: [{ open: '10:00', close: '16:00' }] }
      ];
    }
  });

  const updateSchedule = (newSchedule: DaySchedule[]) => {
    setSchedule(newSchedule);
    // Convert schedule to string format
    const formattedSchedule = newSchedule
      .map(day => {
        const slots = day.slots
          .map(slot => `${slot.open}-${slot.close}`)
          .join(', ');
        return `${day.day}: ${slots}`;
      })
      .join('\n');
    onChange(formattedSchedule);
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots.push({ open: '09:00', close: '17:00' });
    updateSchedule(newSchedule);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots = newSchedule[dayIndex].slots.filter((_, i) => i !== slotIndex);
    if (newSchedule[dayIndex].slots.length === 0) {
      newSchedule[dayIndex].slots.push({ open: '09:00', close: '17:00' });
    }
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
        <div key={day.day} className="space-y-2">
          <div className="flex items-center gap-2">
            <Select
              value={day.day}
              onValueChange={(newDay) => {
                const newSchedule = [...schedule];
                newSchedule[dayIndex].day = newDay;
                updateSchedule(newSchedule);
              }}
            >
              <SelectTrigger className="w-[200px] bg-accent border-accent text-white">
                <SelectValue placeholder="Wähle einen Tag" />
              </SelectTrigger>
              <SelectContent className="bg-accent border-accent">
                <SelectItem value="Montag" className="text-white">Montag</SelectItem>
                <SelectItem value="Dienstag" className="text-white">Dienstag</SelectItem>
                <SelectItem value="Mittwoch" className="text-white">Mittwoch</SelectItem>
                <SelectItem value="Donnerstag" className="text-white">Donnerstag</SelectItem>
                <SelectItem value="Freitag" className="text-white">Freitag</SelectItem>
                <SelectItem value="Samstag" className="text-white">Samstag</SelectItem>
                <SelectItem value="Sonntag" className="text-white">Sonntag</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {day.slots.map((slot, slotIndex) => (
            <div key={slotIndex} className="flex items-center gap-2">
              <Input
                type="time"
                value={slot.open}
                onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'open', e.target.value)}
                className="w-32 bg-accent border-accent text-white"
              />
              <span className="text-white">-</span>
              <Input
                type="time"
                value={slot.close}
                onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'close', e.target.value)}
                className="w-32 bg-accent border-accent text-white"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                className="text-white hover:text-white/80"
              >
                <Minus className="h-4 w-4" />
              </Button>
              {slotIndex === day.slots.length - 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => addTimeSlot(dayIndex)}
                  className="text-white hover:text-white/80"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}