import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { OnboardingFormData } from './types';
import { InterestsSection } from './form-sections/InterestsSection';
import { AgeRangesSection } from './form-sections/AgeRangesSection';
import { DistanceSection } from './form-sections/DistanceSection';
import { AccessibilitySection } from './form-sections/AccessibilitySection';
import { Progress } from '@/components/ui/progress';
import { Filters } from '../FilterBar';

interface OnboardingFormProps {
  onComplete: () => void;
  onFiltersChange: (filters: Filters) => void;
}

const steps = [
  { id: 'interests', title: 'Interessen', component: InterestsSection },
  { id: 'ages', title: 'Altersgruppen', component: AgeRangesSection },
  { id: 'distance', title: 'Entfernung', component: DistanceSection },
  { id: 'accessibility', title: 'Barrierefreiheit', component: AccessibilitySection },
];

export const OnboardingForm = ({ onComplete, onFiltersChange }: OnboardingFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      if (error) {
        console.error('Error generating recommendations:', error);
        throw error;
      }

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
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Fehler",
          description: "Sie müssen eingeloggt sein, um Präferenzen zu speichern.",
          variant: "destructive",
        });
        return;
      }

      // First check if user preferences already exist
      const { data: existingPrefs, error: fetchError } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error fetching preferences:', fetchError);
        throw fetchError;
      }

      const preferencesData = {
        user_id: user.id,
        interests: data.interests,
        child_age_ranges: data.childAgeRanges,
        max_distance: parseInt(data.maxDistance),
        accessibility_needs: data.accessibilityNeeds,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (existingPrefs) {
        // Update existing preferences
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update(preferencesData)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new preferences
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert([preferencesData]);
        error = insertError;
      }

      if (error) {
        console.error('Error saving preferences:', error);
        throw error;
      }

      // Apply filters based on preferences
      onFiltersChange({
        type: data.interests[0], // Using first interest as type
        ageRange: data.childAgeRanges[0], // Using first age range
        distance: data.maxDistance,
      });

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            Schritt {currentStep + 1}: {steps[currentStep].title}
          </h3>
          <Progress value={progress} className="h-2" />
        </div>

        <CurrentStepComponent form={form} />

        <div className="flex justify-between space-x-4">
          {currentStep > 0 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              disabled={isSubmitting}
            >
              Zurück
            </Button>
          )}
          <Button 
            type="button" 
            onClick={nextStep}
            className={currentStep === 0 ? "w-full" : ""}
            disabled={isSubmitting}
          >
            {currentStep === steps.length - 1 ? "Abschließen" : "Weiter"}
          </Button>
        </div>
      </form>
    </Form>
  );
};