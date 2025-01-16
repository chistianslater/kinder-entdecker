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
import { X, Tag } from "lucide-react";

const activityTypes = [
  { value: "Natur & Wandern", label: "Natur & Wandern" },
  { value: "Sport & Bewegung", label: "Sport & Bewegung" },
  { value: "Kultur & Museum", label: "Kultur & Museum" },
  { value: "Kreativ & Basteln", label: "Kreativ & Basteln" },
  { value: "Tiere & Zoo", label: "Tiere & Zoo" },
];

interface TypeSelectorProps {
  form: UseFormReturn<FormData>;
}

export function TypeSelector({ form }: TypeSelectorProps) {
  const handleTypeSelect = (value: string) => {
    const currentValues = form.getValues("type") || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    form.setValue("type", newValues, { shouldValidate: true });
  };

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => {
        const currentValues = Array.isArray(field.value) ? field.value : [];

        return (
          <FormItem className="space-y-4">
            <FormLabel className="text-lg font-medium text-white">Typ</FormLabel>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {activityTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeSelect(type.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-sm
                              ${currentValues.includes(type.value)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-[#1E2128] text-white hover:bg-[#2A2F3A]'}`}
                  >
                    <Tag className="h-4 w-4" />
                    {type.label}
                  </button>
                ))}
              </div>
              {currentValues.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {currentValues.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="bg-primary/20 text-white border border-primary/40 px-3 py-1.5"
                    >
                      {type}
                      <button
                        className="ml-2 hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTypeSelect(type);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <FormMessage className="text-white" />
          </FormItem>
        );
      }}
    />
  );
}