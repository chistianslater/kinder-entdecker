import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';

interface SortSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

export const SortSelect = ({ value, onChange }: SortSelectProps) => {
  const isMobile = useIsMobile();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger 
        className={`bg-secondary text-white hover:bg-accent/80 border-accent/20 transition-all duration-300 
                   hover:scale-105 rounded-3xl ${isMobile ? 'w-full' : 'w-[180px]'}`}
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <SelectValue placeholder="Sortieren" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-secondary text-white border border-accent/20 shadow-glass">
        <SelectItem value="newest" className="text-white focus:bg-accent focus:text-white">Neueste zuerst</SelectItem>
        <SelectItem value="oldest" className="text-white focus:bg-accent focus:text-white">Älteste zuerst</SelectItem>
        <SelectItem value="rating" className="text-white focus:bg-accent focus:text-white">Beste Bewertung</SelectItem>
        <SelectItem value="distance" className="text-white focus:bg-accent focus:text-white">Nächstgelegene</SelectItem>
      </SelectContent>
    </Select>
  );
};