import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFormData } from '../types';

const accessibilityOptions = [
  { id: 'stroller', label: 'Kinderwagenfreundlich' },
  { id: 'wheelchair', label: 'Barrierefrei' },
  { id: 'changing', label: 'Wickelmöglichkeiten' },
  { id: 'food', label: 'Essen vor Ort' },
];

interface AccessibilitySectionProps {
  form: UseFormReturn<OnboardingFormData>;
}

export const AccessibilitySection = ({ form }: AccessibilitySectionProps) => {
  return (
    <FormField
      control={form.control}
      name="accessibilityNeeds"
      render={() => (
        <FormItem>
          <div className="grid grid-cols-2 gap-4">
            {accessibilityOptions.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name="accessibilityNeeds"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0 animate-fade-in">
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
                    <FormLabel className="font-normal text-white">{item.label}</FormLabel>
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