import React, { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import debounce from 'lodash/debounce';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const [inputValue, setInputValue] = useState(value);
  const { toast } = useToast();

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching token:', error);
          throw error;
        }

        if (!data?.token) {
          throw new Error('No token received');
        }

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${data.token}&country=de&types=place,locality,neighborhood,address&language=de`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch location suggestions');
        }

        const responseData = await response.json();
        const features = Array.isArray(responseData.features) ? responseData.features : [];
        const newSuggestions = features.map((feature: any) => ({
          id: feature.id,
          place_name: feature.place_name,
          center: feature.center,
        }));

        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching location suggestions:', err);
        toast({
          title: "Fehler",
          description: "Standortvorschläge konnten nicht geladen werden.",
          variant: "destructive",
        });
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [toast]
  );

  const handleSelect = (suggestion: LocationSuggestion) => {
    const [lng, lat] = suggestion.center;
    setInputValue(suggestion.place_name);
    onChange(suggestion.place_name, { x: lng, y: lat });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('', { x: 0, y: 0 });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Ort suchen..."
          className="w-full text-white placeholder:text-gray-400 bg-accent border-accent pr-16"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {inputValue && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-white/10 rounded-full"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          )}
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
        </div>
      </div>
      
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