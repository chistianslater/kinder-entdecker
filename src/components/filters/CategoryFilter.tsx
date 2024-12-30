import React from 'react';
import { TreePine } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="bg-white hover:bg-secondary/80 border-accent rounded-xl min-w-[140px]">
        <TreePine className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Kategorie" />
      </SelectTrigger>
      <SelectContent className="bg-white border border-accent shadow-md">
        <SelectItem value="nature">Natur & Wandern</SelectItem>
        <SelectItem value="sports">Sport & Bewegung</SelectItem>
        <SelectItem value="culture">Kultur & Museum</SelectItem>
        <SelectItem value="creative">Kreativ & Basteln</SelectItem>
        <SelectItem value="animals">Tiere & Zoo</SelectItem>
      </SelectContent>
    </Select>
  );
};