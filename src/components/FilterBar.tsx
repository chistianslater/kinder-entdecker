import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Baby, Euro, TreePine } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type Filters = {
  type?: string;
  ageRange?: string;
  priceRange?: string;
  category?: string;
};

interface FilterBarProps {
  onFiltersChange: (filters: Filters) => void;
}

const FilterBar = ({ onFiltersChange }: FilterBarProps) => {
  const [filters, setFilters] = useState<Filters>({});

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="bg-white shadow-soft rounded-2xl p-6 mb-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {/* Indoor/Outdoor Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="bg-secondary/50 hover:bg-secondary border-accent flex items-center gap-2 rounded-xl min-w-[140px]"
            >
              <Sun className="w-4 h-4" />
              {filters.type || 'Indoor/Outdoor'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-3">
            <RadioGroup
              value={filters.type}
              onValueChange={(value) => handleFilterChange('type', value)}
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

        {/* Age Range Filter */}
        <Select
          value={filters.ageRange}
          onValueChange={(value) => handleFilterChange('ageRange', value)}
        >
          <SelectTrigger className="bg-secondary/50 hover:bg-secondary border-accent rounded-xl min-w-[140px]">
            <Baby className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Altersgruppe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-2">0-2 Jahre</SelectItem>
            <SelectItem value="3-5">3-5 Jahre</SelectItem>
            <SelectItem value="6-8">6-8 Jahre</SelectItem>
            <SelectItem value="9-12">9-12 Jahre</SelectItem>
            <SelectItem value="all">Alle Alter</SelectItem>
          </SelectContent>
        </Select>

        {/* Price Range Filter */}
        <Select
          value={filters.priceRange}
          onValueChange={(value) => handleFilterChange('priceRange', value)}
        >
          <SelectTrigger className="bg-secondary/50 hover:bg-secondary border-accent rounded-xl min-w-[140px]">
            <Euro className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Preis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Kostenlos</SelectItem>
            <SelectItem value="low">Günstig (bis 10€)</SelectItem>
            <SelectItem value="medium">Mittel (10-30€)</SelectItem>
            <SelectItem value="high">Teuer (30€+)</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger className="bg-secondary/50 hover:bg-secondary border-accent rounded-xl min-w-[140px]">
            <TreePine className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nature">Natur & Wandern</SelectItem>
            <SelectItem value="sports">Sport & Bewegung</SelectItem>
            <SelectItem value="culture">Kultur & Museum</SelectItem>
            <SelectItem value="creative">Kreativ & Basteln</SelectItem>
            <SelectItem value="animals">Tiere & Zoo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;