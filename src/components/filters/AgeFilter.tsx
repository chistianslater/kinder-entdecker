import React from 'react';
import { Baby } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgeFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const AgeFilter = ({ value, onChange }: AgeFilterProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="bg-white hover:bg-secondary/80 border-accent rounded-xl min-w-[140px]">
        <Baby className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Altersgruppe" />
      </SelectTrigger>
      <SelectContent className="bg-white border border-accent shadow-md">
        <SelectItem value="0-2">0-2 Jahre</SelectItem>
        <SelectItem value="3-5">3-5 Jahre</SelectItem>
        <SelectItem value="6-8">6-8 Jahre</SelectItem>
        <SelectItem value="9-12">9-12 Jahre</SelectItem>
        <SelectItem value="all">Alle Alter</SelectItem>
      </SelectContent>
    </Select>
  );
};