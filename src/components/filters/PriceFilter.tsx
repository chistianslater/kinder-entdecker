import React from 'react';
import { Euro } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';
import { Label } from "@/components/ui/label";

interface PriceFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const PriceFilter = ({ value, onChange }: PriceFilterProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "space-y-3 w-full" : ""}>
      {isMobile && <Label className="text-base">Preis</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`bg-white hover:bg-secondary/80 border-accent ${isMobile ? 'w-full' : 'w-[180px]'}`}>
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4" />
            <SelectValue placeholder="Preis" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-accent shadow-md">
          <SelectItem value="free">Kostenlos</SelectItem>
          <SelectItem value="low">Günstig</SelectItem>
          <SelectItem value="medium">Mittel</SelectItem>
          <SelectItem value="high">Teuer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};