import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingFormData {
  interests: string[];
  childAgeRanges: string[];
  maxDistance: string;
  accessibilityNeeds: string[];
}

interface OnboardingFormProps {
  onComplete: () => void;
}

const interests = [
  { id: 'nature', label: 'Natur (Wälder, Parks)' },
  { id: 'adventure', label: 'Abenteuer (Spielplätze, Kletterparks)' },
  { id: 'culture', label: 'Kultur (Museen, Indoor-Spiele)' },
  { id: 'relaxation', label: 'Entspannung (Picknickplätze)' },
];

const ageRanges = [
  { id: '0-2', label: '0-2 Jahre' },
  { id: '3-5', label: '3-5 Jahre' },
  { id: '6-8', label: '6-8 Jahre' },
  { id: '9-12', label: '9-12 Jahre' },
  { id: '13+', label: '13+ Jahre' },
];

const accessibilityOptions = [
  { id: 'stroller', label: 'Kinderwagenfreundlich' },
  { id: 'wheelchair', label: 'Barrierefrei' },
  { id: 'changing', label: 'Wickelmöglichkeiten' },
  { id: 'food', label: 'Essen vor Ort' },
];

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

      // Generate recommendations after saving preferences
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
        <FormField
          control={form.control}
          name="interests"
          render={() => (
            <FormItem>
              <FormLabel>Welche Art von Ausflügen bevorzugen Sie?</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {interests.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              const value = field.value || [];
                              return checked
                                ? field.onChange([...value, item.id])
                                : field.onChange(value.filter((val) => val !== item.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="childAgeRanges"
          render={() => (
            <FormItem>
              <FormLabel>Alter der Kinder</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {ageRanges.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="childAgeRanges"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              const value = field.value || [];
                              return checked
                                ? field.onChange([...value, item.id])
                                : field.onChange(value.filter((val) => val !== item.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxDistance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wie weit möchten Sie maximal fahren?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen Sie eine maximale Entfernung" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="5">5 km</SelectItem>
                  <SelectItem value="10">10 km</SelectItem>
                  <SelectItem value="20">20 km</SelectItem>
                  <SelectItem value="50">50 km</SelectItem>
                  <SelectItem value="0">Keine Begrenzung</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accessibilityNeeds"
          render={() => (
            <FormItem>
              <FormLabel>Besondere Bedürfnisse</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {accessibilityOptions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="accessibilityNeeds"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              const value = field.value || [];
                              return checked
                                ? field.onChange([...value, item.id])
                                : field.onChange(value.filter((val) => val !== item.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Speichern und fortfahren
        </Button>
      </form>
    </Form>
  );
};