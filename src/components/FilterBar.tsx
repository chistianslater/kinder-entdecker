import React, { useState, useEffect } from 'react';
import { TypeFilter } from './filters/TypeFilter';
import { AgeFilter } from './filters/AgeFilter';
import { PriceFilter } from './filters/PriceFilter';
import { CategoryFilter } from './filters/CategoryFilter';
import { DistanceFilter } from './filters/DistanceFilter';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type Filters = {
  type?: string;
  ageRange?: string;
  priceRange?: string;
  category?: string;
  distance?: string;
};

interface FilterBarProps {
  onFiltersChange: (filters: Filters) => void;
}

const FilterBar = ({ onFiltersChange }: FilterBarProps) => {
  const [filters, setFilters] = useState<Filters>({});
  const { toast } = useToast();

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const applyUserPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Nicht eingeloggt",
          description: "Bitte melden Sie sich an, um Ihre Präferenzen zu laden.",
          variant: "destructive",
        });
        return;
      }

      const { data: preferences, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (preferences) {
        const newFilters: Filters = {
          type: preferences.interests?.[0], // Using first interest as type
          ageRange: preferences.child_age_ranges?.[0], // Using first age range
          distance: preferences.max_distance?.toString(),
        };

        setFilters(newFilters);
        onFiltersChange(newFilters);

        toast({
          title: "Präferenzen geladen",
          description: "Ihre persönlichen TinyTrails wurden geladen.",
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: "Fehler",
        description: "Ihre Präferenzen konnten nicht geladen werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white shadow-soft rounded-2xl p-6 mb-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        <Button
          variant="outline"
          className="flex items-center gap-2 min-w-[140px] bg-white hover:bg-secondary/80 border-accent"
          onClick={applyUserPreferences}
        >
          <Heart className="w-4 h-4" />
          Mein TinyTrails
        </Button>
        <DistanceFilter
          value={filters.distance}
          onChange={(value) => handleFilterChange('distance', value)}
        />
        <TypeFilter 
          value={filters.type}
          onChange={(value) => handleFilterChange('type', value)}
        />
        <AgeFilter
          value={filters.ageRange}
          onChange={(value) => handleFilterChange('ageRange', value)}
        />
        <PriceFilter
          value={filters.priceRange}
          onChange={(value) => handleFilterChange('priceRange', value)}
        />
        <CategoryFilter
          value={filters.category}
          onChange={(value) => handleFilterChange('category', value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;