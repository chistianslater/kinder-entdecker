import React from 'react';
import { Euro } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';
import { Label } from "@/components/ui/label";

interface PriceFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const PriceFilter = ({ value, onChange }: PriceFilterProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "space-y-3 w-full" : ""}>
      {isMobile && <Label className="text-base text-white">Preis</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className={`bg-secondary text-white hover:bg-accent/80 border-accent/20 
                     transition-all duration-300 hover:scale-105 rounded-3xl 
                     ${isMobile ? 'w-full' : 'w-[180px]'}`}
        >
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4" />
            <SelectValue placeholder="Preis" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-secondary border border-accent/20 shadow-glass">
          <SelectItem value="free" className="text-white focus:bg-accent focus:text-white">Kostenlos</SelectItem>
          <SelectItem value="low" className="text-white focus:bg-accent focus:text-white">Günstig (bis 10€)</SelectItem>
          <SelectItem value="medium" className="text-white focus:bg-accent focus:text-white">Mittel (10-30€)</SelectItem>
          <SelectItem value="high" className="text-white focus:bg-accent focus:text-white">Teuer (30€+)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};