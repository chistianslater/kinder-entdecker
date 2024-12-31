import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Label } from "@/components/ui/label";

interface OpeningHoursFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const OpeningHoursFilter = ({ value, onChange }: OpeningHoursFilterProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "space-y-3 w-full" : ""}>
      {isMobile && <Label className="text-base">Öffnungszeiten</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`bg-white hover:bg-secondary/80 border-accent ${isMobile ? 'w-full' : 'w-[180px]'}`}>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <SelectValue placeholder="Öffnungszeiten" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-accent shadow-md">
          <SelectItem value="all">Alle</SelectItem>
          <SelectItem value="open">Jetzt geöffnet</SelectItem>
          <SelectItem value="closed">Geschlossen</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};