import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { PreferencesButton } from './PreferencesButton';
import { Filters } from '../FilterBar';

interface FilterButtonsProps {
  isPreferencesActive: boolean;
  onPreferencesClick: () => void;
  activeFiltersCount: number;
  onFilterClick: () => void;
  onReset: () => void;
}

export const FilterButtons = ({
  isPreferencesActive,
  onPreferencesClick,
  activeFiltersCount,
  onFilterClick,
  onReset,
}: FilterButtonsProps) => {
  return (
    <>
      <PreferencesButton 
        isActive={isPreferencesActive}
        onClick={onPreferencesClick}
      />
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-muted text-white hover:bg-accent/10 border-accent/20 
                 transition-all duration-300 hover:scale-105 rounded-2xl"
        onClick={onFilterClick}
      >
        <Filter className="h-4 w-4" />
        <span>Filter</span>
        {activeFiltersCount > 0 && (
          <Badge 
            variant="secondary"
            className="ml-2 bg-accent text-accent-foreground animate-scale-in rounded-xl"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
      <Button
        variant="ghost"
        className="ml-auto flex items-center gap-2 text-white hover:text-primary 
                 transition-colors duration-300"
        onClick={onReset}
      >
        <Sparkles className="h-4 w-4" />
        <span>Zurücksetzen</span>
      </Button>
    </>
  );
};