import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { TimeSlot as TimeSlotComponent } from './TimeSlot';
import { generateTimeOptions } from './utils';

interface TimeSlot {
  open: string;
  close: string;
}

interface DayScheduleProps {
  day: string;
  slots: TimeSlot[];
  onDayToggle: (checked: boolean) => void;
  onAddSlot: () => void;
  onUpdateSlot: (slotIndex: number, field: 'open' | 'close', value: string) => void;
  onDeleteSlot: (slotIndex: number) => void;
  maxSlots: number;
}

export const DaySchedule = React.memo(({
  day,
  slots,
  onDayToggle,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot,
  maxSlots,
}: DayScheduleProps) => {
  const timeOptions = React.useMemo(() => generateTimeOptions(), []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={slots.length > 0}
          onCheckedChange={(checked) => onDayToggle(checked as boolean)}
          className="border-white/20"
        />
        <span className="text-base text-white">{day}</span>
      </div>
      
      {slots.length > 0 && (
        <div className="space-y-4 pl-8">
          {slots.map((slot, slotIndex) => (
            <TimeSlotComponent
              key={`${day}-${slotIndex}`}
              slot={slot}
              timeOptions={timeOptions}
              onUpdate={(field, value) => onUpdateSlot(slotIndex, field, value)}
              onDelete={() => onDeleteSlot(slotIndex)}
            />
          ))}
          {slots.length < maxSlots && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAddSlot}
              className="text-white hover:text-white hover:bg-white/10 w-full"
            >
              <Plus className="w-4 h-4 text-white" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

DaySchedule.displayName = 'DaySchedule';