import React from 'react';
import { TreePine } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';
import { Label } from "@/components/ui/label";

interface CategoryFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "space-y-3 w-full" : ""}>
      {isMobile && <Label className="text-base text-white">Kategorie</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className={`bg-secondary text-white hover:bg-accent/80 border-accent/20 
                     transition-all duration-300 hover:scale-105 rounded-3xl 
                     ${isMobile ? 'w-full' : 'w-[180px]'}`}
        >
          <div className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            <SelectValue placeholder="Kategorie" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-secondary border border-accent/20 shadow-glass">
          <SelectItem value="Sport & Bewegung" className="text-white focus:bg-accent focus:text-white">Sport & Bewegung</SelectItem>
          <SelectItem value="Natur & Wandern" className="text-white focus:bg-accent focus:text-white">Natur & Wandern</SelectItem>
          <SelectItem value="Kultur & Museum" className="text-white focus:bg-accent focus:text-white">Kultur & Museum</SelectItem>
          <SelectItem value="Kreativ & Basteln" className="text-white focus:bg-accent focus:text-white">Kreativ & Basteln</SelectItem>
          <SelectItem value="Tiere & Zoo" className="text-white focus:bg-accent focus:text-white">Tiere & Zoo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};