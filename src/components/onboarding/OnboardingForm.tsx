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
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { SupabaseClient } from '@supabase/supabase-js';

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
  showAuth?: boolean;
  supabaseClient?: SupabaseClient;
}

export const OnboardingForm = ({ 
  onComplete, 
  onFiltersChange, 
  onSkip, 
  initialPreferences,
  showAuth,
  supabaseClient 
}: OnboardingFormProps) => {
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
      
      if (showAuth && supabaseClient && step === sections.length - 1) {
        setStep(step + 1);
      } else {
        onComplete();
      }

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

  const CurrentSection = sections[step]?.component;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6 animate-fade-in">
          {step < sections.length ? (
            <>
              <h2 className="text-xl font-medium text-white mb-4">{sections[step].title}</h2>
              <CurrentSection form={form} />
            </>
          ) : (
            <>
              <h2 className="text-xl font-medium text-white mb-4">Erstelle dein Konto</h2>
              {supabaseClient && (
                <Auth
                  supabaseClient={supabaseClient}
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
                        },
                      },
                    },
                    className: {
                      button: 'text-black',
                      anchor: 'text-gray-400 hover:text-gray-300',
                      label: 'text-gray-300',
                    },
                  }}
                  localization={{
                    variables: {
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
                      sign_in: {
                        email_label: 'E-Mail Adresse',
                        password_label: 'Passwort',
                        email_input_placeholder: 'Deine E-Mail Adresse',
                        password_input_placeholder: 'Dein Passwort',
                        button_label: 'Registrieren',
                        loading_button_label: 'Anmeldung...',
                        social_provider_text: 'Mit {{provider}} anmelden',
                        link_text: 'Bereits ein Konto? Anmelden',
                      },
                      forgotten_password: {
                        email_label: 'E-Mail Adresse',
                        password_label: 'Passwort',
                        email_input_placeholder: 'Deine E-Mail Adresse',
                        button_label: 'Passwort zurücksetzen',
                        loading_button_label: 'Sende Anweisungen...',
                        link_text: 'Passwort vergessen?',
                      },
                    },
                  }}
                  theme="dark"
                  providers={[]}
                />
              )}
            </>
          )}
        </div>
        
        <div className="flex flex-col space-y-4">
          {step < sections.length && (
            <div className="flex justify-between space-x-4">
              {step > 0 && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={previousStep}
                  className="w-1/2 text-white hover:text-white"
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
                  Weiter zum Konto
                </Button>
              )}
            </div>
          )}
          
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