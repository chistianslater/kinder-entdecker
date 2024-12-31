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
      {isMobile && <Label className="text-base">Kategorie</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`bg-white hover:bg-secondary/80 border-accent ${isMobile ? 'w-full' : 'w-[180px]'}`}>
          <div className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            <SelectValue placeholder="Kategorie" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-accent shadow-md">
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