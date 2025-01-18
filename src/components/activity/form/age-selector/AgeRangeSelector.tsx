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
import { X, Baby } from "lucide-react";

const ageRanges = [
  { value: "0-3", label: "0-3 Jahre" },
  { value: "4-6", label: "4-6 Jahre" },
  { value: "7-12", label: "7-12 Jahre" },
  { value: "13-16", label: "13-16 Jahre" },
  { value: "all", label: "Alle Jahre" },
];

interface AgeRangeSelectorProps {
  form: UseFormReturn<FormData>;
  onChange?: (value: string[]) => void;
}

export function AgeRangeSelector({ form, onChange }: AgeRangeSelectorProps) {
  const handleAgeRangeSelect = (value: string) => {
    const currentValues = form.getValues("age_range") || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    form.setValue("age_range", newValues, { shouldValidate: true });
    if (onChange) {
      onChange(newValues);
    }
  };

  const removeAgeRange = (valueToRemove: string) => {
    const currentValues = form.getValues("age_range") || [];
    const newValues = currentValues.filter((value) => value !== valueToRemove);
    form.setValue("age_range", newValues, { shouldValidate: true });
    if (onChange) {
      onChange(newValues);
    }
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
              <div className="flex flex-wrap gap-2">
                {ageRanges.map((range) => (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => handleAgeRangeSelect(range.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-sm
                              ${field.value?.includes(range.value)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-[#1E2128] text-white hover:bg-[#2A2F3A]'}`}
                  >
                    <Baby className="h-4 w-4" />
                    {range.label}
                  </button>
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