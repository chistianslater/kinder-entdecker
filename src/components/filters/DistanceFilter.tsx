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
        <SelectTrigger className="w-[180px] bg-white border-gray-200">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <SelectValue placeholder="Entfernung" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
          <SelectItem value="5" className="hover:bg-gray-100">5 km</SelectItem>
          <SelectItem value="10" className="hover:bg-gray-100">10 km</SelectItem>
          <SelectItem value="20" className="hover:bg-gray-100">20 km</SelectItem>
          <SelectItem value="50" className="hover:bg-gray-100">50 km</SelectItem>
          <SelectItem value="all" className="hover:bg-gray-100">Alle anzeigen</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};