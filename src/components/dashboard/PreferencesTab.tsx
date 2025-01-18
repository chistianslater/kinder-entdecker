import React, { useEffect, useState } from 'react';
import { OnboardingForm } from '../onboarding/OnboardingForm';
import { useToast } from '@/components/ui/use-toast';
import { Filters } from '../FilterBar';
import { supabase } from '@/integrations/supabase/client';
import LoadingState from '../activity/LoadingState';
import { OnboardingFormData } from '../onboarding/types';

export const PreferencesTab = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [initialPreferences, setInitialPreferences] = useState<OnboardingFormData | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Fehler",
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

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading preferences:', error);
          toast({
            title: "Fehler",
            description: "Ihre Präferenzen konnten nicht geladen werden.",
            variant: "destructive",
          });
          return;
        }

        if (preferences) {
          setInitialPreferences({
            interests: preferences.interests || [],
            childAgeRanges: preferences.child_age_ranges || [],
            maxDistance: preferences.max_distance?.toString() || "10",
            accessibilityNeeds: preferences.accessibility_needs || [],
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [toast]);

  const handleFiltersChange = (filters: Filters) => {
    toast({
      title: "Präferenzen aktualisiert",
      description: "Ihre Einstellungen wurden erfolgreich gespeichert.",
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-white">Meine Präferenzen</h2>
      <OnboardingForm 
        onComplete={() => {}} 
        onFiltersChange={handleFiltersChange}
        initialPreferences={initialPreferences || undefined}
        onSkip={() => {}}
      />
    </div>
  );
};