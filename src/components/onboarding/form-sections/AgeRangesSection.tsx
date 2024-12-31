import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFormData } from '../types';

const ageRanges = [
  { id: '0-2', label: '0-2 Jahre' },
  { id: '3-5', label: '3-5 Jahre' },
  { id: '6-8', label: '6-8 Jahre' },
  { id: '9-12', label: '9-12 Jahre' },
  { id: '13+', label: '13+ Jahre' },
];

interface AgeRangesSectionProps {
  form: UseFormReturn<OnboardingFormData>;
}

export const AgeRangesSection = ({ form }: AgeRangesSectionProps) => {
  return (
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
  );
};