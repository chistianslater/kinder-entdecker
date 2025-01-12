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
    const filterKeys: (keyof Filters)[] = [
      'type',
      'ageRange',
      'activityType',
      'priceRange',
      'distance',
      'openingHours',
      'minRating',
      'sortBy',
      'userLocation'
    ];

    filterKeys.forEach((key) => {
      onFilterChange(key, '');
    });

    console.log('Filters reset');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border border-accent/20 shadow-glass">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white">Filter Activities</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-6">
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
        <DialogFooter className="sm:justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto bg-muted text-white hover:bg-accent/10 border-accent/20 
                     transition-all duration-300 hover:scale-105 rounded-2xl"
          >
            Reset Filters
          </Button>
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90
                     transition-all duration-300 hover:scale-105 rounded-2xl"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};