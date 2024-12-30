import React, { useState } from 'react';
import ActivityList from '@/components/ActivityList';
import FilterBar from '@/components/FilterBar';
import { Button } from '@/components/ui/button';
import { TreePine, Users, MapPin } from 'lucide-react';

const Index = () => {
  const [view, setView] = useState<'list'>('list');

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-white shadow-soft p-6 rounded-b-3xl">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <TreePine className="w-8 h-8" />
            KidsGo
          </h1>
          <p className="text-muted-foreground mt-2">Entdecke Aktivitäten für die ganze Familie</p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button
            variant="outline"
            className="bg-white hover:bg-accent/10 border-2 border-accent p-6 h-auto flex flex-col items-center gap-3 rounded-2xl shadow-soft"
          >
            <MapPin className="w-8 h-8 text-primary" />
            <span className="text-lg font-medium">Orte entdecken</span>
          </Button>
          
          <Button
            variant="outline"
            className="bg-white hover:bg-accent/10 border-2 border-accent p-6 h-auto flex flex-col items-center gap-3 rounded-2xl shadow-soft"
          >
            <Users className="w-8 h-8 text-primary" />
            <span className="text-lg font-medium">Familienaktivitäten</span>
          </Button>
          
          <Button
            variant="outline"
            className="bg-white hover:bg-accent/10 border-2 border-accent p-6 h-auto flex flex-col items-center gap-3 rounded-2xl shadow-soft"
          >
            <TreePine className="w-8 h-8 text-primary" />
            <span className="text-lg font-medium">Naturerlebnisse</span>
          </Button>
        </div>

        <FilterBar />
        <ActivityList />
      </main>
    </div>
  );
};

export default Index;