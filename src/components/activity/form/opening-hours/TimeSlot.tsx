import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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

interface TimeSlotProps {
  slot: TimeSlot;
  timeOptions: string[];
  onUpdate: (field: 'open' | 'close', value: string) => void;
  onDelete: () => void;
}

export const TimeSlot = React.memo(({ 
  slot, 
  timeOptions,
  onUpdate,
  onDelete,
}: TimeSlotProps) => (
  <div className="grid grid-cols-[1fr,auto,1fr,auto] gap-3 items-center">
    <div className="space-y-1">
      <span className="text-xs text-white/60">Öffnet um</span>
      <Select
        value={slot.open}
        onValueChange={(value) => onUpdate('open', value)}
      >
        <SelectTrigger className="bg-background border-white/10 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background border-accent/20">
          {timeOptions.map((time) => (
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
        onValueChange={(value) => onUpdate('close', value)}
      >
        <SelectTrigger className="bg-background border-white/10 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background border-accent/20">
          {timeOptions.map((time) => (
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
      onClick={onDelete}
      className="mt-6 text-white hover:text-white hover:bg-white/10"
    >
      <Trash2 className="w-4 h-4 text-white" />
    </Button>
  </div>
));

TimeSlot.displayName = 'TimeSlot';