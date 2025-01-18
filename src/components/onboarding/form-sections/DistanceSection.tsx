import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFormData } from '../types';

interface DistanceSectionProps {
  form: UseFormReturn<OnboardingFormData>;
}

export const DistanceSection = ({ form }: DistanceSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="maxDistance"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xl font-medium text-white">Wie weit möchten Sie maximal fahren?</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="text-white bg-secondary border-accent/20">
                <SelectValue placeholder="Wählen Sie eine maximale Entfernung" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-secondary border-accent/20">
              <SelectItem value="5" className="text-white">5 km</SelectItem>
              <SelectItem value="10" className="text-white">10 km</SelectItem>
              <SelectItem value="20" className="text-white">20 km</SelectItem>
              <SelectItem value="50" className="text-white">50 km</SelectItem>
              <SelectItem value="all" className="text-white">Alle anzeigen</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};