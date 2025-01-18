import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InterestsSection } from './form-sections/InterestsSection';
import { AgeRangesSection } from './form-sections/AgeRangesSection';
import { DistanceSection } from './form-sections/DistanceSection';
import { AccessibilitySection } from './form-sections/AccessibilitySection';
import { useToast } from "@/components/ui/use-toast";
import { Filters } from '../FilterBar';
import { OnboardingFormData, FormSchema } from './types';

const formSchema = z.object({
  interests: z.array(z.string()).min(1, "Bitte wähle mindestens ein Interesse aus"),
  childAgeRanges: z.array(z.string()).min(1, "Bitte wähle mindestens eine Altersgruppe aus"),
  maxDistance: z.string(),
  accessibilityNeeds: z.array(z.string()),
});

interface OnboardingFormProps {
  onComplete: () => void;
  onFiltersChange: (filters: Filters) => void;
  onSkip: () => void;
  initialPreferences?: OnboardingFormData;
}

export const OnboardingForm = ({ onComplete, onFiltersChange, onSkip, initialPreferences }: OnboardingFormProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: initialPreferences?.interests || [],
      childAgeRanges: initialPreferences?.childAgeRanges || [],
      maxDistance: initialPreferences?.maxDistance?.toString() || "10",
      accessibilityNeeds: initialPreferences?.accessibilityNeeds || [],
    },
  });

  const sections = [
    { component: InterestsSection, title: "Was interessiert dich?" },
    { component: AgeRangesSection, title: "Für welche Altersgruppen suchst du?" },
    { component: DistanceSection, title: "Wie weit möchtest du maximal fahren?" },
    { component: AccessibilitySection, title: "Hast du besondere Bedürfnisse?" }
  ];

  const nextStep = () => {
    if (step < sections.length - 1) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (values: FormSchema) => {
    try {
      const filters: Filters = {
        type: values.interests[0],
        ageRange: values.childAgeRanges[0],
        distance: values.maxDistance,
      };

      onFiltersChange(filters);
      onComplete();

      toast({
        title: "Super!",
        description: "Deine Präferenzen wurden gespeichert.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Ups!",
        description: "Deine Präferenzen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  const CurrentSection = sections[step].component;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-medium text-white mb-4">{sections[step].title}</h2>
          <CurrentSection form={form} />
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between space-x-4">
            {step > 0 && (
              <Button 
                type="button" 
                variant="outline"
                onClick={previousStep}
                className="w-1/2"
              >
                Zurück
              </Button>
            )}
            
            {step < sections.length - 1 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className={step === 0 ? "w-full" : "w-1/2"}
              >
                Weiter
              </Button>
            ) : (
              <Button 
                type="submit"
                className={step === 0 ? "w-full" : "w-1/2"}
              >
                Los geht's!
              </Button>
            )}
          </div>
          
          <Button
            type="button"
            variant="link"
            onClick={onSkip}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            Ich habe bereits ein Konto
          </Button>
        </div>
      </form>
    </Form>
  );
};