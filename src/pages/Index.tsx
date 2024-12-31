import React, { useState } from 'react';
import ActivityList from '@/components/ActivityList';
import Map from '@/components/Map';
import EventView from '@/components/EventView';
import Header from '@/components/layout/Header';
import ViewToggle from '@/components/layout/ViewToggle';
import { useActivities } from '@/hooks/useActivities';

type ViewMode = 'list' | 'map' | 'events';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { filteredActivities } = useActivities();

  const renderContent = () => {
    switch (viewMode) {
      case 'map':
        return <Map activities={filteredActivities} />;
      case 'events':
        return <EventView />;
      default:
        return <ActivityList />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        <div className="space-y-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;