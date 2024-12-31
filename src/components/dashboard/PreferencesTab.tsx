import React from 'react';
import { OnboardingForm } from '../onboarding/OnboardingForm';
import { useToast } from '@/components/ui/use-toast';
import { Filters } from '../FilterBar';

export const PreferencesTab = () => {
  const { toast } = useToast();

  const handleFiltersChange = (filters: Filters) => {
    toast({
      title: "Präferenzen aktualisiert",
      description: "Ihre Einstellungen wurden erfolgreich gespeichert.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Meine Präferenzen</h2>
      <OnboardingForm 
        onComplete={() => {}} 
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
};