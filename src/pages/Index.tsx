import React, { useState } from 'react';
import Map from '@/components/Map';
import ActivityList from '@/components/ActivityList';
import FilterBar from '@/components/FilterBar';
import { Button } from '@/components/ui/button';
import { MapPin, List } from 'lucide-react';

const Index = () => {
  const [view, setView] = useState<'map' | 'list'>('map');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-soft p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-primary">KidsGo</h1>
        </div>
      </header>

      <main className="container mx-auto py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              variant={view === 'map' ? 'default' : 'outline'}
              onClick={() => setView('map')}
              className="flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Karte
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              onClick={() => setView('list')}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              Liste
            </Button>
          </div>
        </div>

        <FilterBar />

        {view === 'map' ? <Map /> : <ActivityList />}
      </main>
    </div>
  );
};

export default Index;