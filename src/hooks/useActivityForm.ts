import { useState } from "react";
import { FormData } from "@/components/activity/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchCoordinates } from "@/utils/coordinates";

export function useActivityForm(onSuccess?: () => void) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FormData, initialData?: any) => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const coordinates = await fetchCoordinates(data.location);

      const activityData = {
        title: data.title,
        description: data.description,
        location: data.location,
        coordinates,
        type: data.type,
        age_range: data.age_range,
        price_range: data.price_range,
        opening_hours: data.opening_hours,
        ticket_url: data.ticket_url,
        image_url: data.image_url,
        updated_at: new Date().toISOString(),
      };

      if (initialData) {
        const { error } = await supabase
          .from('activities')
          .update(activityData)
          .eq('id', initialData.id);

        if (error) throw error;

        toast({
          title: "Erfolg",
          description: "Aktivität wurde erfolgreich aktualisiert.",
        });
      } else {
        const { error } = await supabase
          .from('activities')
          .insert({
            ...activityData,
            created_by: user.id,
          });

        if (error) throw error;

        toast({
          title: "Erfolg",
          description: "Aktivität wurde erfolgreich erstellt.",
        });
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}