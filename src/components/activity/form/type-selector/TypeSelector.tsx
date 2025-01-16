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
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => {
        const currentValues = Array.isArray(field.value) ? field.value : [];

        const handleTypeSelect = (checked: boolean, value: string) => {
          const updatedValues = checked
            ? [...currentValues, value]
            : currentValues.filter((v) => v !== value);
          form.setValue("type", updatedValues, { shouldValidate: true });
        };

        return (
          <FormItem className="flex flex-col">
            <FormLabel className="text-white mb-2">Typ</FormLabel>
            <div className="grid grid-cols-2 gap-4">
              {activityTypes.map((type) => (
                <FormItem
                  key={type.value}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={currentValues.includes(type.value)}
                      onCheckedChange={(checked) => 
                        handleTypeSelect(checked as boolean, type.value)
                      }
                      className="bg-accent data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-white font-normal">
                    {type.label}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {currentValues.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="bg-accent/50 text-white"
                  onClick={() => handleTypeSelect(false, type)}
                >
                  {type}
                  <button
                    className="ml-1 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTypeSelect(false, type);
                    }}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <FormMessage className="text-white" />
          </FormItem>
        );
      }}
    />
  );
}