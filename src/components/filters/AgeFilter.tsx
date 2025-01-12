import React from 'react';
import { Baby } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';
import { Label } from "@/components/ui/label";

interface AgeFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const AgeFilter = ({ value, onChange }: AgeFilterProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile ? "space-y-3 w-full" : ""}>
      {isMobile && <Label className="text-base text-white">Altersgruppe</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className={`bg-secondary text-white hover:bg-accent/80 border-accent/20 
                     transition-all duration-300 hover:scale-105 rounded-3xl 
                     ${isMobile ? 'w-full' : 'w-[180px]'}`}
        >
          <div className="flex items-center gap-2">
            <Baby className="h-4 w-4" />
            <SelectValue placeholder="Altersgruppe" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-secondary border border-accent/20 shadow-glass">
          <SelectItem value="0-2" className="text-white focus:bg-accent focus:text-white">0-2 Jahre</SelectItem>
          <SelectItem value="3-5" className="text-white focus:bg-accent focus:text-white">3-5 Jahre</SelectItem>
          <SelectItem value="6-8" className="text-white focus:bg-accent focus:text-white">6-8 Jahre</SelectItem>
          <SelectItem value="9-12" className="text-white focus:bg-accent focus:text-white">9-12 Jahre</SelectItem>
          <SelectItem value="all" className="text-white focus:bg-accent focus:text-white">Alle Alter</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};