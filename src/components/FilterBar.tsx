import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Home, Euro, Baby } from 'lucide-react';

const FilterBar = () => {
  return (
    <div className="p-4 bg-white shadow-soft rounded-lg mb-4">
      <div className="flex gap-4 overflow-x-auto pb-2">
        <Button variant="outline" className="flex items-center gap-2">
          <Sun className="w-4 h-4" />
          Indoor/Outdoor
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Baby className="w-4 h-4" />
          Altersgruppe
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Euro className="w-4 h-4" />
          Preis
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Kategorie
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;