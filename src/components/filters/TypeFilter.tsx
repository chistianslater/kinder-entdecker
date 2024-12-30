import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TypeFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const TypeFilter = ({ value, onChange }: TypeFilterProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-white hover:bg-secondary/80 border-accent flex items-center gap-2 rounded-xl min-w-[140px]"
        >
          <Sun className="w-4 h-4" />
          {value || 'Indoor/Outdoor'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-3 bg-white border border-accent shadow-md">
        <RadioGroup
          value={value}
          onValueChange={onChange}
        >
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="indoor" id="indoor" />
            <Label htmlFor="indoor">Indoor</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="outdoor" id="outdoor" />
            <Label htmlFor="outdoor">Outdoor</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both">Beides</Label>
          </div>
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
};