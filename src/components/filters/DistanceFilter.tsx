import React from 'react';
import { MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';
import { Label } from "@/components/ui/label";

interface DistanceFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const DistanceFilter = ({ value, onChange }: DistanceFilterProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "space-y-3 w-full" : ""}>
      {isMobile && <Label className="text-base text-white">Entfernung</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className={`bg-secondary text-white hover:bg-accent/80 border-accent/20 
                     transition-all duration-300 hover:scale-105 rounded-3xl 
                     ${isMobile ? 'w-full' : 'w-[180px]'}`}
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <SelectValue placeholder="Entfernung" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-secondary border border-accent/20 shadow-glass">
          <SelectItem value="5" className="text-white focus:bg-accent focus:text-white">5 km</SelectItem>
          <SelectItem value="10" className="text-white focus:bg-accent focus:text-white">10 km</SelectItem>
          <SelectItem value="20" className="text-white focus:bg-accent focus:text-white">20 km</SelectItem>
          <SelectItem value="50" className="text-white focus:bg-accent focus:text-white">50 km</SelectItem>
          <SelectItem value="all" className="text-white focus:bg-accent focus:text-white">Alle anzeigen</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};