import React, { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import debounce from 'lodash/debounce';
import { supabase } from "@/integrations/supabase/client";

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
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const { data: { token }, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
        if (tokenError) throw tokenError;

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${token}&country=de&types=place,locality,neighborhood,address&language=de`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch location suggestions');
        }

        const data = await response.json();
        const features = Array.isArray(data.features) ? data.features : [];
        const newSuggestions = features.map((feature: any) => ({
          id: feature.id,
          place_name: feature.place_name,
          center: feature.center,
        }));

        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching location suggestions:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleSelect = (suggestion: LocationSuggestion) => {
    const [lng, lat] = suggestion.center;
    onChange(suggestion.place_name, { x: lng, y: lat });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value, { x: 0, y: 0 });
          fetchSuggestions(e.target.value);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Ort suchen..."
        className="w-full text-white placeholder:text-gray-400 bg-accent border-accent"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-2.5">
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-accent border border-accent rounded-md shadow-md">
          <div className="p-1">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                className="w-full text-left px-2 py-1.5 text-sm text-white rounded hover:bg-muted"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion.place_name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}