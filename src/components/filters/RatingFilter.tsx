import React from 'react';
import { Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';
import { Label } from "@/components/ui/label";

interface RatingFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const RatingFilter = ({ value, onChange }: RatingFilterProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "space-y-3 w-full" : ""}>
      {isMobile && <Label className="text-base text-white">Mindestbewertung</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className={`bg-secondary text-white hover:bg-accent/80 border-accent/20 
                     transition-all duration-300 hover:scale-105 rounded-3xl 
                     ${isMobile ? 'w-full' : 'w-[180px]'}`}
        >
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <SelectValue placeholder="Mindestbewertung" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-secondary border border-accent/20 shadow-glass">
          <SelectItem value="1" className="text-white focus:bg-accent focus:text-white">⭐ & höher</SelectItem>
          <SelectItem value="2" className="text-white focus:bg-accent focus:text-white">⭐⭐ & höher</SelectItem>
          <SelectItem value="3" className="text-white focus:bg-accent focus:text-white">⭐⭐⭐ & höher</SelectItem>
          <SelectItem value="4" className="text-white focus:bg-accent focus:text-white">⭐⭐⭐⭐ & höher</SelectItem>
          <SelectItem value="5" className="text-white focus:bg-accent focus:text-white">⭐⭐⭐⭐⭐</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};