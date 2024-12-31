import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface MobileFilterButtonProps {
  activeFiltersCount: number;
  className?: string;
}

export const MobileFilterButton = ({ activeFiltersCount, className }: MobileFilterButtonProps) => {
  return (
    <Button 
      variant="outline" 
      className={`flex-1 flex items-center justify-between bg-white hover:bg-secondary/80 border-accent ${className}`}
    >
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span>Filter</span>
      </div>
      {activeFiltersCount > 0 && (
        <span className="bg-primary text-white px-2 py-0.5 rounded-full text-sm">
          {activeFiltersCount}
        </span>
      )}
    </Button>
  );
};