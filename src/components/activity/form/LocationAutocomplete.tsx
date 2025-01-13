import React, { useState, useCallback } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import debounce from 'lodash/debounce';

interface LocationSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (location: string, coordinates: { x: number; y: number }) => void;
}

export function LocationAutocomplete({ value, onChange }: LocationAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&country=de&types=place,locality,neighborhood,address&language=de`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setSuggestions(data.features.map((feature: any) => ({
          id: feature.id,
          place_name: feature.place_name,
          center: feature.center,
        })));
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  const handleSelect = (suggestion: LocationSuggestion) => {
    const [lng, lat] = suggestion.center;
    onChange(suggestion.place_name, { x: lng, y: lat });
    setOpen(false);
    setSearchValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Ort auswählen..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false} className="w-full">
          <CommandInput 
            placeholder="Ort suchen..."
            value={searchValue}
            onValueChange={(newValue) => {
              setSearchValue(newValue);
              fetchSuggestions(newValue);
            }}
          />
          <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
          <CommandGroup>
            {suggestions.map((suggestion) => (
              <CommandItem
                key={suggestion.id}
                value={suggestion.place_name}
                onSelect={() => handleSelect(suggestion)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === suggestion.place_name ? "opacity-100" : "opacity-0"
                  )}
                />
                {suggestion.place_name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}