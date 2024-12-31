import React, { useState } from 'react';
import ActivityList from '@/components/ActivityList';
import { Button } from '@/components/ui/button';
import { TreePine, Users, MapPin, Footprints, List, Map as MapIcon, Calendar } from 'lucide-react';
import Map from '@/components/Map';
import EventView from '@/components/EventView';
import { useActivities } from '@/hooks/useActivities';

type ViewMode = 'list' | 'map' | 'events';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { filteredActivities } = useActivities();

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-white shadow-soft p-6 rounded-b-3xl">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12c3-2 6-3 9-3s6 1 9 3" />
                <path d="M3 6c3-2 6-3 9-3s6 1 9 3" />
                <path d="M3 18c3-2 6-3 9-3s6 1 9 3" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                TinyTrails
                <Footprints className="w-6 h-6" />
              </h1>
              <p className="text-muted-foreground mt-1">Entdecke Abenteuer für die ganze Familie</p>
            </div>
          </div>
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

        <div className="bg-white shadow-soft rounded-2xl p-6 mb-6">
          <div className="flex justify-end gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              Liste
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              onClick={() => setViewMode('map')}
              className="flex items-center gap-2"
            >
              <MapIcon className="w-4 h-4" />
              Karte
            </Button>
            <Button
              variant={viewMode === 'events' ? 'default' : 'outline'}
              onClick={() => setViewMode('events')}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Events
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {viewMode === 'map' ? (
            <Map activities={filteredActivities} />
          ) : viewMode === 'events' ? (
            <EventView />
          ) : (
            <ActivityList />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;