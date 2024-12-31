import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import ActivityList from '@/components/ActivityList';
import Map from '@/components/Map';
import EventView from '@/components/EventView';
import Header from '@/components/layout/Header';
import ViewToggle from '@/components/layout/ViewToggle';
import { useActivities } from '@/hooks/useActivities';
import { OnboardingDialog } from '@/components/onboarding/OnboardingDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'list' | 'map' | 'events';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [session, setSession] = useState<any>(null);
  const { filteredActivities } = useActivities();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkUserPreferences = async () => {
      if (!session?.user) return;

      try {
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!preferences) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking user preferences:', error);
        toast({
          title: "Error",
          description: "Could not load user preferences",
          variant: "destructive",
        });
      }
    };

    checkUserPreferences();
  }, [session, toast]);

  const renderContent = () => {
    if (!session) {
      return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Willkommen bei TinyTrails</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={[]}
          />
        </div>
      );
    }

    return (
      <>
        <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        <div className="space-y-8">
          {viewMode === 'map' ? (
            <Map activities={filteredActivities} />
          ) : viewMode === 'events' ? (
            <EventView />
          ) : (
            <ActivityList />
          )}
        </div>
        <OnboardingDialog 
          open={showOnboarding} 
          onOpenChange={setShowOnboarding}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Header />
      <main className="container mx-auto py-8 px-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;