import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from 'lucide-react';

interface DistanceFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const DistanceFilter = ({ value, onChange }: DistanceFilterProps) => {
  return (
    <div className="flex-shrink-0">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] bg-white">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <SelectValue placeholder="Entfernung" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 km</SelectItem>
          <SelectItem value="10">10 km</SelectItem>
          <SelectItem value="20">20 km</SelectItem>
          <SelectItem value="50">50 km</SelectItem>
          <SelectItem value="all">Alle anzeigen</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};