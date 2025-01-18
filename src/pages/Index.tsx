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
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [session, setSession] = useState<any>(null);
  const { filteredActivities, handleFiltersChange } = useActivities();
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

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowAuth(true);
  };

  const renderContent = () => {
    if (!session) {
      if (showOnboarding) {
        return (
          <OnboardingDialog 
            open={showOnboarding} 
            onOpenChange={setShowOnboarding}
            onFiltersChange={handleFiltersChange}
            onComplete={handleOnboardingComplete}
          />
        );
      }

      if (showAuth) {
        return (
          <div className="max-w-md mx-auto mt-8 p-6 bg-card rounded-2xl shadow-glass border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-center text-white">Willkommen bei TinyTrails</h2>
            <Auth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#B5FF2B',
                      brandAccent: '#9EE619',
                      inputBackground: 'rgba(255, 255, 255, 0.08)',
                      inputText: '#FFFFFF',
                      anchorTextColor: 'rgba(255, 255, 255, 0.6)',
                      dividerBackground: 'rgba(255, 255, 255, 0.08)',
                      defaultButtonBackground: '#B5FF2B',
                      defaultButtonBackgroundHover: '#9EE619',
                      defaultButtonBorder: 'transparent',
                      defaultButtonText: '#000000',
                    },
                    fonts: {
                      bodyFontFamily: 'Inter var, sans-serif',
                      buttonFontFamily: 'Inter var, sans-serif',
                      inputFontFamily: 'Inter var, sans-serif',
                      labelFontFamily: 'Inter var, sans-serif',
                    },
                    radii: {
                      borderRadiusButton: '8px',
                      buttonBorderRadius: '8px',
                      inputBorderRadius: '8px',
                    },
                  },
                },
                className: {
                  button: 'text-black',
                  anchor: 'text-gray-400 hover:text-gray-300',
                },
              }}
              theme="dark"
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'E-Mail Adresse',
                    password_label: 'Passwort',
                    email_input_placeholder: 'Deine E-Mail Adresse',
                    password_input_placeholder: 'Dein Passwort',
                    button_label: 'Anmelden',
                    loading_button_label: 'Anmeldung...',
                    social_provider_text: 'Mit {{provider}} anmelden',
                    link_text: 'Bereits ein Konto? Anmelden',
                  },
                  sign_up: {
                    email_label: 'E-Mail Adresse',
                    password_label: 'Passwort',
                    email_input_placeholder: 'Deine E-Mail Adresse',
                    password_input_placeholder: 'Dein Passwort',
                    button_label: 'Registrieren',
                    loading_button_label: 'Registrierung...',
                    social_provider_text: 'Mit {{provider}} registrieren',
                    link_text: 'Kein Konto? Registrieren',
                  },
                  forgotten_password: {
                    email_label: 'E-Mail Adresse',
                    password_label: 'Passwort',
                    email_input_placeholder: 'Deine E-Mail Adresse',
                    button_label: 'Passwort zurücksetzen',
                    loading_button_label: 'Sende Anweisungen...',
                    link_text: 'Passwort vergessen?',
                  },
                  update_password: {
                    password_label: 'Neues Passwort',
                    password_input_placeholder: 'Dein neues Passwort',
                    button_label: 'Passwort aktualisieren',
                    loading_button_label: 'Passwort wird aktualisiert...',
                  },
                },
              }}
            />
          </div>
        );
      }
    }

    return (
      <>
        <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        <div className="space-y-8 relative">
          {viewMode === 'map' ? (
            <Map activities={filteredActivities} />
          ) : viewMode === 'events' ? (
            <EventView />
          ) : (
            <ActivityList />
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;