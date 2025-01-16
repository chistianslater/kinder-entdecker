import React from 'react';
import { DaySchedule as DayScheduleComponent } from './opening-hours/DaySchedule';
import { Switch } from "@/components/ui/switch";
import { 
  DAYS,
  MAX_SLOTS_PER_DAY,
  parseOpeningHours,
  formatSchedule,
  type DaySchedule
} from './opening-hours/utils';

interface OpeningHoursInputProps {
  value: string;
  onChange: (value: string) => void;
}

function OpeningHoursInput({ value, onChange }: OpeningHoursInputProps) {
  const [schedule, setSchedule] = React.useState<DaySchedule[]>(() =>
    parseOpeningHours(value)
  );
  const [isAlwaysOpen, setIsAlwaysOpen] = React.useState(() => 
    value.toLowerCase() === '24/7'
  );

  const updateSchedule = React.useCallback((newSchedule: DaySchedule[]) => {
    const formattedValue = formatSchedule(newSchedule, isAlwaysOpen);
    if (formattedValue !== value) {
      onChange(formattedValue);
      setSchedule(newSchedule);
    }
  }, [onChange, value, isAlwaysOpen]);

  const handleDayToggle = React.useCallback((dayIndex: number, checked: boolean) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule];
      newSchedule[dayIndex].slots = checked ? [{ open: '09:00', close: '17:00' }] : [];
      return newSchedule;
    });
  }, []);

  const handleAddSlot = React.useCallback((dayIndex: number) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule];
      if (newSchedule[dayIndex].slots.length < MAX_SLOTS_PER_DAY) {
        newSchedule[dayIndex].slots.push({ open: '09:00', close: '17:00' });
        return newSchedule;
      }
      return prevSchedule;
    });
  }, []);

  const handleUpdateSlot = React.useCallback((
    dayIndex: number, 
    slotIndex: number, 
    field: 'open' | 'close', 
    value: string
  ) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule];
      newSchedule[dayIndex].slots[slotIndex][field] = value;
      return newSchedule;
    });
  }, []);

  const handleDeleteSlot = React.useCallback((dayIndex: number, slotIndex: number) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule];
      newSchedule[dayIndex].slots.splice(slotIndex, 1);
      return newSchedule;
    });
  }, []);

  const handleAlwaysOpenChange = React.useCallback((checked: boolean) => {
    setIsAlwaysOpen(checked);
    if (checked) {
      onChange('24/7');
    } else {
      const formattedValue = formatSchedule(schedule, false);
      onChange(formattedValue);
    }
  }, [onChange, schedule]);

  React.useEffect(() => {
    if (!isAlwaysOpen) {
      const formattedValue = formatSchedule(schedule, false);
      if (formattedValue !== value) {
        onChange(formattedValue);
      }
    }
  }, [schedule, onChange, value, isAlwaysOpen]);

  return (
    <div className="space-y-4 bg-accent rounded-lg p-4">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <span className="text-sm text-white/60">Immer geöffnet</span>
        <Switch
          checked={isAlwaysOpen}
          onCheckedChange={handleAlwaysOpenChange}
        />
      </div>

      {!isAlwaysOpen && schedule.map((daySchedule, dayIndex) => (
        <DayScheduleComponent
          key={daySchedule.day}
          day={daySchedule.day}
          slots={daySchedule.slots}
          onDayToggle={(checked) => handleDayToggle(dayIndex, checked)}
          onAddSlot={() => handleAddSlot(dayIndex)}
          onUpdateSlot={(slotIndex, field, value) => 
            handleUpdateSlot(dayIndex, slotIndex, field, value)
          }
          onDeleteSlot={(slotIndex) => handleDeleteSlot(dayIndex, slotIndex)}
          maxSlots={MAX_SLOTS_PER_DAY}
        />
      ))}
    </div>
  );
}

export const MemoizedOpeningHoursInput = React.memo(OpeningHoursInput);
MemoizedOpeningHoursInput.displayName = 'OpeningHoursInput';

export { MemoizedOpeningHoursInput as OpeningHoursInput };