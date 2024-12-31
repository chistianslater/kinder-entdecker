import React from 'react';
import { Button } from "@/components/ui/button";
import { TreePine } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CategoryFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
  const getDisplayText = (value: string | undefined) => {
    switch (value) {
      case 'Natur & Wandern':
        return 'Natur & Wandern';
      case 'Sport & Bewegung':
        return 'Sport & Bewegung';
      case 'Kultur & Museum':
        return 'Kultur & Museum';
      case 'Kreativ & Basteln':
        return 'Kreativ & Basteln';
      case 'Tiere & Zoo':
        return 'Tiere & Zoo';
      default:
        return 'Kategorie';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-white hover:bg-secondary/80 border-accent flex items-center gap-2 rounded-xl min-w-[140px]"
        >
          <TreePine className="w-4 h-4" />
          {getDisplayText(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-3 bg-white border border-accent shadow-md">
        <RadioGroup
          value={value}
          onValueChange={onChange}
        >
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="Sport & Bewegung" id="sports" />
            <Label htmlFor="sports">Sport & Bewegung</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="Natur & Wandern" id="nature" />
            <Label htmlFor="nature">Natur & Wandern</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="Kultur & Museum" id="culture" />
            <Label htmlFor="culture">Kultur & Museum</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="Kreativ & Basteln" id="creative" />
            <Label htmlFor="creative">Kreativ & Basteln</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Tiere & Zoo" id="animals" />
            <Label htmlFor="animals">Tiere & Zoo</Label>
          </div>
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
};