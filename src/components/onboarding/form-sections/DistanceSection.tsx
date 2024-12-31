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
              <SelectItem value="all">Alle anzeigen</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};