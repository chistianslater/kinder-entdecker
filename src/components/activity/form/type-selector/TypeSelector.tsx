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
          <FormItem className="space-y-4">
            <FormLabel className="text-lg font-medium text-white">Typ</FormLabel>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activityTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
                              ${currentValues.includes(type.value)
                                ? 'bg-primary/20 border border-primary'
                                : 'bg-accent/20 border border-accent/20 hover:border-accent/40'}`}
                  >
                    <FormControl>
                      <Checkbox
                        checked={currentValues.includes(type.value)}
                        onCheckedChange={(checked) => 
                          handleTypeSelect(checked as boolean, type.value)
                        }
                        className="border-white/20 data-[state=checked]:bg-primary 
                                 data-[state=checked]:text-primary-foreground"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium cursor-pointer m-0
                                       text-white hover:text-primary transition-colors">
                      {type.label}
                    </FormLabel>
                  </div>
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
                          handleTypeSelect(false, type);
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