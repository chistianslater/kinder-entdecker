import React from 'react';
import { Sun } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';
import { Label } from "@/components/ui/label";

interface TypeFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const TypeFilter = ({ value, onChange }: TypeFilterProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "space-y-3 w-full" : ""}>
      {isMobile && <Label className="text-base text-white">Indoor/Outdoor</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className={`bg-secondary text-white hover:bg-accent/80 border-accent/20 
                     transition-all duration-300 hover:scale-105 rounded-3xl 
                     ${isMobile ? 'w-full' : 'w-[180px]'}`}
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <SelectValue placeholder="Indoor/Outdoor" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-secondary border border-accent/20 shadow-glass">
          <SelectItem value="indoor" className="text-white focus:bg-accent focus:text-white">Indoor</SelectItem>
          <SelectItem value="outdoor" className="text-white focus:bg-accent focus:text-white">Outdoor</SelectItem>
          <SelectItem value="both" className="text-white focus:bg-accent focus:text-white">Beides</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};