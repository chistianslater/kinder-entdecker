import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InterestsSection } from './form-sections/InterestsSection';
import { AgeRangesSection } from './form-sections/AgeRangesSection';
import { DistanceSection } from './form-sections/DistanceSection';
import { AccessibilitySection } from './form-sections/AccessibilitySection';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Filters } from '../FilterBar';
import { OnboardingFormData, FormSchema } from './types';

const formSchema = z.object({
  interests: z.array(z.string()).min(1, "Bitte wählen Sie mindestens ein Interesse aus"),
  childAgeRanges: z.array(z.string()).min(1, "Bitte wählen Sie mindestens eine Altersgruppe aus"),
  maxDistance: z.string(),
  accessibilityNeeds: z.array(z.string()),
});

interface OnboardingFormProps {
  onComplete: () => void;
  onFiltersChange: (filters: Filters) => void;
  initialPreferences?: OnboardingFormData;
}

export const OnboardingForm = ({ onComplete, onFiltersChange, initialPreferences }: OnboardingFormProps) => {
  const { toast } = useToast();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: initialPreferences?.interests || [],
      childAgeRanges: initialPreferences?.childAgeRanges || [],
      maxDistance: initialPreferences?.maxDistance?.toString() || "10",
      accessibilityNeeds: initialPreferences?.accessibilityNeeds || [],
    },
  });

  const onSubmit = async (values: FormSchema) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Fehler",
          description: "Bitte melden Sie sich an, um Ihre Präferenzen zu speichern.",
          variant: "destructive",
        });
        return;
      }

      const preferences = {
        user_id: user.id,
        interests: values.interests,
        child_age_ranges: values.childAgeRanges,
        max_distance: parseInt(values.maxDistance),
        accessibility_needs: values.accessibilityNeeds,
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert(preferences, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      // Convert form values to filters
      const filters: Filters = {
        type: values.interests[0],
        ageRange: values.childAgeRanges[0],
        distance: values.maxDistance,
      };

      onFiltersChange(filters);
      onComplete();

      toast({
        title: "Erfolg",
        description: "Ihre Präferenzen wurden erfolgreich gespeichert.",
      });
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <InterestsSection form={form} />
        <AgeRangesSection form={form} />
        <DistanceSection form={form} />
        <AccessibilitySection form={form} />
        
        <Button type="submit" className="w-full">
          Präferenzen speichern
        </Button>
      </form>
    </Form>
  );
};