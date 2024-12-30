import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Home, Euro, Baby, TreePine, MapPin, Users } from 'lucide-react';

const FilterBar = () => {
  return (
    <div className="bg-white shadow-soft rounded-2xl p-6 mb-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        <Button
          variant="outline"
          className="bg-secondary/50 hover:bg-secondary border-accent flex items-center gap-2 rounded-xl"
        >
          <Sun className="w-4 h-4" />
          Indoor/Outdoor
        </Button>
        <Button
          variant="outline"
          className="bg-secondary/50 hover:bg-secondary border-accent flex items-center gap-2 rounded-xl"
        >
          <Baby className="w-4 h-4" />
          Altersgruppe
        </Button>
        <Button
          variant="outline"
          className="bg-secondary/50 hover:bg-secondary border-accent flex items-center gap-2 rounded-xl"
        >
          <Euro className="w-4 h-4" />
          Preis
        </Button>
        <Button
          variant="outline"
          className="bg-secondary/50 hover:bg-secondary border-accent flex items-center gap-2 rounded-xl"
        >
          <TreePine className="w-4 h-4" />
          Kategorie
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;