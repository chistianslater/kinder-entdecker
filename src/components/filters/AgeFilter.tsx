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
      {isMobile && <Label className="text-base">Altersgruppe</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className={`bg-white hover:bg-secondary/20 transition-colors rounded-full border-none shadow-sm px-4 ${isMobile ? 'w-full' : 'w-[180px]'}`}
        >
          <div className="flex items-center gap-2">
            <Baby className="h-4 w-4" />
            <SelectValue placeholder="Altersgruppe" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border-none shadow-md">
          <SelectItem value="0-2">0-2 Jahre</SelectItem>
          <SelectItem value="3-5">3-5 Jahre</SelectItem>
          <SelectItem value="6-8">6-8 Jahre</SelectItem>
          <SelectItem value="9-12">9-12 Jahre</SelectItem>
          <SelectItem value="all">Alle Alter</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};