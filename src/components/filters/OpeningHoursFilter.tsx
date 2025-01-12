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
      {isMobile && <Label className="text-base text-white">Öffnungszeiten</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className={`bg-secondary text-white hover:bg-accent/80 border-accent/20 
                     transition-all duration-300 hover:scale-105 rounded-3xl 
                     ${isMobile ? 'w-full' : 'w-[180px]'}`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <SelectValue placeholder="Öffnungszeiten" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-secondary border border-accent/20 shadow-glass">
          <SelectItem value="all" className="text-white focus:bg-accent focus:text-white">Alle</SelectItem>
          <SelectItem value="open" className="text-white focus:bg-accent focus:text-white">Jetzt geöffnet</SelectItem>
          <SelectItem value="closed" className="text-white focus:bg-accent focus:text-white">Geschlossen</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};