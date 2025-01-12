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
          className={`bg-muted text-white hover:bg-accent/10 border-accent/20 
                     transition-all duration-300 hover:scale-105 rounded-2xl 
                     ${isMobile ? 'w-full' : 'w-[180px]'}`}
        >
          <div className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            <SelectValue placeholder="Kategorie" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-background border border-accent/20 shadow-glass">
          <SelectItem value="Sport & Bewegung">Sport & Bewegung</SelectItem>
          <SelectItem value="Natur & Wandern">Natur & Wandern</SelectItem>
          <SelectItem value="Kultur & Museum">Kultur & Museum</SelectItem>
          <SelectItem value="Kreativ & Basteln">Kreativ & Basteln</SelectItem>
          <SelectItem value="Tiere & Zoo">Tiere & Zoo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};