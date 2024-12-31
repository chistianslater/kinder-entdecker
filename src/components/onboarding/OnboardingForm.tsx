import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { OnboardingFormData } from './types';
import { InterestsSection } from './form-sections/InterestsSection';
import { AgeRangesSection } from './form-sections/AgeRangesSection';
import { DistanceSection } from './form-sections/DistanceSection';
import { AccessibilitySection } from './form-sections/AccessibilitySection';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

interface OnboardingFormProps {
  onComplete?: () => void;
  onFiltersChange: (filters: {
    type?: string;
    ageRange?: string;
    distance?: string;
  }) => void;
}

export const OnboardingForm = ({ onComplete, onFiltersChange }: OnboardingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  
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
        description: "Ihre personalisierten Empfehlungen wurden erstellt.",
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Fehler",
        description: "Empfehlungen konnten nicht erstellt werden.",
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
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error fetching preferences:', fetchError);
        throw fetchError;
      }

      let error;
      if (existingPrefs) {
        // Update existing preferences
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({
            interests: data.interests,
            child_age_ranges: data.childAgeRanges,
            max_distance: parseInt(data.maxDistance),
            accessibility_needs: data.accessibilityNeeds,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new preferences
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            interests: data.interests,
            child_age_ranges: data.childAgeRanges,
            max_distance: parseInt(data.maxDistance),
            accessibility_needs: data.accessibilityNeeds,
          });
        error = insertError;
      }

      if (error) {
        console.error('Error saving preferences:', error);
        throw error;
      }

      // Apply filters based on preferences
      onFiltersChange({
        type: data.interests[0],
        ageRange: data.childAgeRanges[0],
        distance: data.maxDistance,
      });

      await generateRecommendations(user.id);

      toast({
        title: "Erfolgreich gespeichert",
        description: "Ihre Präferenzen wurden erfolgreich gespeichert.",
      });

      if (onComplete) onComplete();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Fehler",
        description: "Ihre Präferenzen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <InterestsSection form={form} />
          <AgeRangesSection form={form} />
          <DistanceSection form={form} />
          <AccessibilitySection form={form} />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Wird gespeichert..." : "Präferenzen speichern"}
        </Button>
      </form>
    </Form>
  );
};