import React, { useState, useEffect } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { useIsMobile } from '@/hooks/use-mobile';
import { PreferencesButton } from './filters/PreferencesButton';
import { FilterDialog } from './filters/FilterDialog';
import { SortSelect } from './filters/SortSelect';
import { Button } from './ui/button';
import { Filter, Sparkles, Leaf, Sun } from 'lucide-react';
import { Badge } from './ui/badge';

export interface Filters {
  type?: string;
  ageRange?: string;
  activityType?: string;
  priceRange?: string;
  distance?: string;
  openingHours?: string;
  minRating?: string;
  sortBy?: string;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface FilterBarProps {
  onFiltersChange: (filters: Filters) => void;
}

const FilterBar = ({ onFiltersChange }: FilterBarProps) => {
  const [filters, setFilters] = useState<Filters>({});
  const [isPreferencesActive, setIsPreferencesActive] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { applyUserPreferences } = usePreferences({ 
    onFiltersChange, 
    setFilters 
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    if (isPreferencesActive) {
      setIsPreferencesActive(false);
    }
    
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePreferencesClick = () => {
    if (isPreferencesActive) {
      setFilters({});
      onFiltersChange({});
      setIsPreferencesActive(false);
    } else {
      applyUserPreferences();
      setIsPreferencesActive(true);
    }
  };

  const getActiveFiltersCount = () => {
    const { sortBy, ...otherFilters } = filters;
    return Object.values(otherFilters).filter(value => value !== undefined && value !== '').length;
  };

  return (
    <div className={`rounded-3xl p-4 mb-6 transition-all duration-300 ${
      isSticky ? 'bg-white/50 backdrop-blur-md shadow-card animate-fade-in border border-accent/10' : ''
    }`}>
      <div className="flex items-center gap-3 flex-wrap">
        <PreferencesButton 
          isActive={isPreferencesActive}
          onClick={handlePreferencesClick}
        />
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white hover:bg-accent/10 border-accent/20 
                   transition-all duration-300 hover:scale-105 rounded-2xl"
          onClick={() => setShowFilterDialog(true)}
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {getActiveFiltersCount() > 0 && (
            <Badge 
              variant="secondary"
              className="ml-2 bg-accent text-accent-foreground animate-scale-in rounded-xl"
            >
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
        <SortSelect
          value={filters.sortBy}
          onChange={(value) => handleFilterChange('sortBy', value)}
        />
        
        <Button
          variant="ghost"
          className="ml-auto flex items-center gap-2 text-muted-foreground hover:text-primary 
                   transition-colors duration-300"
          onClick={() => {
            setFilters({});
            onFiltersChange({});
            setIsPreferencesActive(false);
          }}
        >
          <Sparkles className="h-4 w-4" />
          <span>Zurücksetzen</span>
        </Button>
      </div>

      <FilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default FilterBar;