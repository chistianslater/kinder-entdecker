import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '../types';

const interests = [
  { id: 'nature', label: 'Natur & Wandern' },
  { id: 'sports', label: 'Sport & Bewegung' },
  { id: 'culture', label: 'Kultur & Museum' },
  { id: 'creative', label: 'Kreativ & Basteln' },
  { id: 'animals', label: 'Tiere & Zoo' },
];

interface InterestsSectionProps {
  form: UseFormReturn<FormSchema>;
}

export const InterestsSection = ({ form }: InterestsSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="interests"
      render={() => (
        <FormItem>
          <FormLabel className="text-xl font-medium text-white">Welche Art von Aktivitäten interessieren Sie?</FormLabel>
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