import React from 'react';
import { Euro } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PriceFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const PriceFilter = ({ value, onChange }: PriceFilterProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="bg-white hover:bg-secondary/80 border-accent rounded-xl min-w-[140px]">
        <Euro className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Preis" />
      </SelectTrigger>
      <SelectContent className="bg-white border border-accent shadow-md">
        <SelectItem value="free">Kostenlos</SelectItem>
        <SelectItem value="low">Günstig</SelectItem>
        <SelectItem value="medium">Mittel</SelectItem>
        <SelectItem value="high">Teuer</SelectItem>
      </SelectContent>
    </Select>
  );
};