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

interface TypeSelectorProps {
  form: UseFormReturn<FormData>;
}

export function TypeSelector({ form }: TypeSelectorProps) {
  const [open, setOpen] = React.useState(false);
  
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => {
        const currentValues = Array.isArray(field.value) ? field.value : [];
        
        const handleTypeSelect = (value: string) => {
          const updatedValues = currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value];
          form.setValue("type", updatedValues, { shouldValidate: true });
          setOpen(false);
        };

        return (
          <FormItem className="flex flex-col">
            <FormLabel className="text-white">Typ</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
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
                    {currentValues.length > 0
                      ? `${currentValues.length} ausgewählt`
                      : "Typ auswählen"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-accent border-accent">
                <Command className="bg-accent">
                  <CommandInput 
                    placeholder="Suchen..." 
                    className="text-white"
                  />
                  <CommandEmpty className="text-white">
                    Keine Ergebnisse gefunden.
                  </CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {activityTypes.map((type) => (
                      <CommandItem
                        key={type.value}
                        value={type.value}
                        onSelect={() => handleTypeSelect(type.value)}
                        className="text-white hover:bg-accent/50"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentValues.includes(type.value)
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
              {currentValues.map((type) => (
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
        );
      }}
    />
  );
}