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
      {isMobile && <Label className="text-base">Indoor/Outdoor</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className={`bg-white hover:bg-accent/10 border-accent/20 transition-all duration-300 
                     hover:scale-105 rounded-2xl ${isMobile ? 'w-full' : 'w-[180px]'}`}
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <SelectValue placeholder="Indoor/Outdoor" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-accent/20 shadow-md rounded-2xl">
          <SelectItem value="indoor">Indoor</SelectItem>
          <SelectItem value="outdoor">Outdoor</SelectItem>
          <SelectItem value="both">Beides</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};