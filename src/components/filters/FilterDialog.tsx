import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "./CategoryFilter";
import { AgeFilter } from "./AgeFilter";
import { TypeFilter } from "./TypeFilter";
import { PriceFilter } from "./PriceFilter";
import { DistanceFilter } from "./DistanceFilter";
import { OpeningHoursFilter } from "./OpeningHoursFilter";
import { RatingFilter } from "./RatingFilter";
import { Filters } from '../FilterBar';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
}

export const FilterDialog = ({ 
  open, 
  onOpenChange, 
  filters, 
  onFilterChange 
}: FilterDialogProps) => {
  const handleReset = () => {
    Object.keys(filters).forEach((key) => {
      onFilterChange(key as keyof Filters, '');
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>Filter Activities</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <CategoryFilter
              value={filters.type}
              onChange={(value) => onFilterChange('type', value)}
            />
            <AgeFilter
              value={filters.ageRange}
              onChange={(value) => onFilterChange('ageRange', value)}
            />
            <TypeFilter
              value={filters.activityType}
              onChange={(value) => onFilterChange('activityType', value)}
            />
            <PriceFilter
              value={filters.priceRange}
              onChange={(value) => onFilterChange('priceRange', value)}
            />
            <DistanceFilter
              value={filters.distance}
              onChange={(value) => onFilterChange('distance', value)}
            />
            <OpeningHoursFilter
              value={filters.openingHours}
              onChange={(value) => onFilterChange('openingHours', value)}
            />
            <RatingFilter
              value={filters.minRating}
              onChange={(value) => onFilterChange('minRating', value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="transition-all duration-300 hover:scale-105"
          >
            Reset Filters
          </Button>
          <Button 
            type="button"
            onClick={() => onOpenChange(false)}
            className="transition-all duration-300 hover:scale-105"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};