import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../../types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

const ageRanges = [
  { value: "0-3", label: "0-3 Jahre" },
  { value: "4-6", label: "4-6 Jahre" },
  { value: "7-12", label: "7-12 Jahre" },
  { value: "13-16", label: "13-16 Jahre" },
  { value: "all", label: "Alle Altersgruppen" },
];

interface AgeRangeSelectorProps {
  form: UseFormReturn<FormData>;
}

export function AgeRangeSelector({ form }: AgeRangeSelectorProps) {
  const handleAgeRangeSelect = (checked: boolean, value: string) => {
    const currentValues = form.getValues("age_range") || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    form.setValue("age_range", newValues, { shouldValidate: true });
  };

  const removeAgeRange = (valueToRemove: string) => {
    const currentValues = form.getValues("age_range") || [];
    const newValues = currentValues.filter((value) => value !== valueToRemove);
    form.setValue("age_range", newValues, { shouldValidate: true });
  };

  return (
    <FormField
      control={form.control}
      name="age_range"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-medium text-white">Altersgruppe</FormLabel>
          <FormControl>
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ageRanges.map((range) => (
                  <div
                    key={range.value}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
                              ${field.value?.includes(range.value)
                                ? 'bg-primary/20 border border-primary'
                                : 'bg-accent/20 border border-accent/20 hover:border-accent/40'}`}
                  >
                    <Checkbox
                      id={`age-${range.value}`}
                      checked={field.value?.includes(range.value)}
                      onCheckedChange={(checked) => 
                        handleAgeRangeSelect(checked as boolean, range.value)
                      }
                      className="border-white/20 data-[state=checked]:bg-primary 
                               data-[state=checked]:text-primary-foreground"
                    />
                    <label
                      htmlFor={`age-${range.value}`}
                      className="text-sm font-medium leading-none cursor-pointer
                               text-white hover:text-primary transition-colors"
                    >
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {field.value.map((value) => (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="bg-primary/20 text-white border border-primary/40 px-3 py-1.5"
                    >
                      {ageRanges.find((r) => r.value === value)?.label || value}
                      <button
                        type="button"
                        onClick={() => removeAgeRange(value)}
                        className="ml-2 hover:text-primary transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-white" />
        </FormItem>
      )}
    />
  );
}