import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Filters } from '@/components/FilterBar';

interface UsePreferencesProps {
  onFiltersChange: (filters: Filters) => void;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export const usePreferences = ({ onFiltersChange, setFilters }: UsePreferencesProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const applyUserPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Nicht eingeloggt",
          description: "Bitte melden Sie sich an, um Ihre Präferenzen zu laden.",
          variant: "destructive",
        });
        return;
      }

      const { data: preferences, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (preferences) {
        const newFilters: Filters = {
          type: preferences.interests?.[0], // Using first interest as type
          ageRange: preferences.child_age_ranges?.[0], // Using first age range
          distance: preferences.max_distance?.toString(),
        };

        setFilters(newFilters);
        onFiltersChange(newFilters);

        toast({
          title: "Präferenzen geladen",
          description: "Ihre persönlichen Einstellungen wurden geladen.",
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: "Fehler",
        description: "Ihre Präferenzen konnten nicht geladen werden.",
        variant: "destructive",
      });
    }
  };

  return { applyUserPreferences };
};