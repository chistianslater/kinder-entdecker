import React, { useState, useEffect } from 'react';
import ActivityList from '@/components/ActivityList';
import Map from '@/components/Map';
import EventView from '@/components/EventView';
import Header from '@/components/layout/Header';
import ViewToggle from '@/components/layout/ViewToggle';
import { useActivities } from '@/hooks/useActivities';
import { OnboardingDialog } from '@/components/onboarding/OnboardingDialog';
import { supabase } from '@/integrations/supabase/client';

type ViewMode = 'list' | 'map' | 'events';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { filteredActivities } = useActivities();

  useEffect(() => {
    const checkUserPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!preferences) {
          setShowOnboarding(true);
        }
      }
    };

    checkUserPreferences();
  }, []);

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
      <OnboardingDialog 
        open={showOnboarding} 
        onOpenChange={setShowOnboarding}
      />
    </div>
  );
};

export default Index;