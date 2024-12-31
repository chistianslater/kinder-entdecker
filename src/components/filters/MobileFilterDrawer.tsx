import React from 'react';
import {
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "./CategoryFilter";
import { AgeFilter } from "./AgeFilter";
import { TypeFilter } from "./TypeFilter";
import { PriceFilter } from "./PriceFilter";
import { DistanceFilter } from "./DistanceFilter";
import { Filters } from '../FilterBar';

interface MobileFilterDrawerProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onClose: () => void;
}

export const MobileFilterDrawer = ({ filters, onFilterChange, onClose }: MobileFilterDrawerProps) => {
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Filter</DrawerTitle>
      </DrawerHeader>
      <div className="p-4 space-y-4">
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
      </div>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
};