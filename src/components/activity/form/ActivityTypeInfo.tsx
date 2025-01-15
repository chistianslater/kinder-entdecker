import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../types";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

const activityTypes = [
  { value: "Natur & Wandern", label: "Natur & Wandern" },
  { value: "Sport & Bewegung", label: "Sport & Bewegung" },
  { value: "Kultur & Museum", label: "Kultur & Museum" },
  { value: "Kreativ & Basteln", label: "Kreativ & Basteln" },
  { value: "Tiere & Zoo", label: "Tiere & Zoo" },
];

const ageRanges = [
  { value: "0-3", label: "0-3 Jahre" },
  { value: "4-6", label: "4-6 Jahre" },
  { value: "7-12", label: "7-12 Jahre" },
  { value: "13-16", label: "13-16 Jahre" },
  { value: "all", label: "Alle Altersgruppen" },
];

interface ActivityTypeInfoProps {
  form: UseFormReturn<FormData>;
}

export function ActivityTypeInfo({ form }: ActivityTypeInfoProps) {
  const handleTypeSelect = (value: string) => {
    const currentValues = form.getValues("type") || [];
    const newValues = Array.isArray(currentValues) ? currentValues : [];
    const updatedValues = newValues.includes(value)
      ? newValues.filter((v) => v !== value)
      : [...newValues, value];
    form.setValue("type", updatedValues, { shouldValidate: true });
  };

  const handleAgeRangeSelect = (value: string) => {
    const currentValues = form.getValues("age_range") || [];
    const newValues = Array.isArray(currentValues) ? currentValues : [];
    const updatedValues = newValues.includes(value)
      ? newValues.filter((v) => v !== value)
      : [...newValues, value];
    form.setValue("age_range", updatedValues, { shouldValidate: true });
  };

  return (
    <>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-white">Typ</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between bg-accent border-accent text-white",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {Array.isArray(field.value) && field.value.length > 0
                      ? `${field.value.length} ausgewählt`
                      : "Typ auswählen"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-accent border-accent">
                <Command className="bg-accent">
                  <CommandInput placeholder="Suchen..." className="text-white" />
                  <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
                  <CommandGroup>
                    {activityTypes.map((type) => (
                      <CommandItem
                        value={type.value}
                        key={type.value}
                        onSelect={() => handleTypeSelect(type.value)}
                        className="text-white hover:bg-accent/50"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            Array.isArray(field.value) && field.value?.includes(type.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {type.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(field.value) && field.value.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="bg-accent/50 text-white"
                  onClick={() => handleTypeSelect(type)}
                >
                  {type}
                  <button
                    className="ml-1 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTypeSelect(type);
                    }}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <FormMessage className="text-white" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age_range"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-white">Altersgruppe</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between bg-accent border-accent text-white",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {Array.isArray(field.value) && field.value.length > 0
                      ? `${field.value.length} ausgewählt`
                      : "Altersgruppe auswählen"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-accent border-accent">
                <Command className="bg-accent">
                  <CommandInput placeholder="Suchen..." className="text-white" />
                  <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
                  <CommandGroup>
                    {ageRanges.map((range) => (
                      <CommandItem
                        value={range.value}
                        key={range.value}
                        onSelect={() => handleAgeRangeSelect(range.value)}
                        className="text-white hover:bg-accent/50"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            Array.isArray(field.value) && field.value?.includes(range.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {range.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(field.value) && field.value.map((range) => (
                <Badge
                  key={range}
                  variant="secondary"
                  className="bg-accent/50 text-white"
                  onClick={() => handleAgeRangeSelect(range)}
                >
                  {ageRanges.find((r) => r.value === range)?.label || range}
                  <button
                    className="ml-1 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgeRangeSelect(range);
                    }}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <FormMessage className="text-white" />
          </FormItem>
        )}
      />
    </>
  );
}