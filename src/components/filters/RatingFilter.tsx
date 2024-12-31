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
      {isMobile && <Label className="text-base">Mindestbewertung</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`bg-white hover:bg-secondary/80 border-accent ${isMobile ? 'w-full' : 'w-[180px]'}`}>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <SelectValue placeholder="Mindestbewertung" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-accent shadow-md">
          <SelectItem value="1">⭐ & höher</SelectItem>
          <SelectItem value="2">⭐⭐ & höher</SelectItem>
          <SelectItem value="3">⭐⭐⭐ & höher</SelectItem>
          <SelectItem value="4">⭐⭐⭐⭐ & höher</SelectItem>
          <SelectItem value="5">⭐⭐⭐⭐⭐</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};