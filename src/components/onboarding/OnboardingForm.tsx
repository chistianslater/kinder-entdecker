import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { OnboardingFormData } from './types';
import { InterestsSection } from './form-sections/InterestsSection';
import { AgeRangesSection } from './form-sections/AgeRangesSection';
import { DistanceSection } from './form-sections/DistanceSection';
import { AccessibilitySection } from './form-sections/AccessibilitySection';

interface OnboardingFormProps {
  onComplete: () => void;
}

export const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const { toast } = useToast();
  const form = useForm<OnboardingFormData>({
    defaultValues: {
      interests: [],
      childAgeRanges: [],
      maxDistance: '10',
      accessibilityNeeds: [],
    },
  });

  const generateRecommendations = async (userId: string) => {
    try {
      const { error } = await supabase.functions.invoke('generate-recommendations', {
        body: { user_id: userId },
      });

      if (error) throw error;

      toast({
        title: "Empfehlungen erstellt",
        description: "Wir haben personalisierte Empfehlungen für Sie generiert.",
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Fehler",
        description: "Empfehlungen konnten nicht generiert werden.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          interests: data.interests,
          child_age_ranges: data.childAgeRanges,
          max_distance: parseInt(data.maxDistance),
          accessibility_needs: data.accessibilityNeeds,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      await generateRecommendations(user.id);

      toast({
        title: "Einstellungen gespeichert",
        description: "Ihre Präferenzen wurden erfolgreich gespeichert.",
      });

      onComplete();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Fehler",
        description: "Ihre Präferenzen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InterestsSection form={form} />
        <AgeRangesSection form={form} />
        <DistanceSection form={form} />
        <AccessibilitySection form={form} />
        <Button type="submit" className="w-full">
          Speichern und fortfahren
        </Button>
      </form>
    </Form>
  );
};