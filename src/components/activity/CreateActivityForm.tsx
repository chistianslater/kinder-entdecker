import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ActivityBasicInfo } from "./form/ActivityBasicInfo";
import { ActivityTypeInfo } from "./form/ActivityTypeInfo";
import { ActivityImageUpload } from "./form/ActivityImageUpload";
import { ActivityAdditionalInfo } from "./form/ActivityAdditionalInfo";
import { FormData, formSchema } from "./types";

interface CreateActivityFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

export function CreateActivityForm({ onSuccess, onCancel, initialData }: CreateActivityFormProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description || "",
      location: initialData.location,
      type: initialData.type,
      age_range: initialData.age_range || "",
      price_range: initialData.price_range || "",
      opening_hours: initialData.opening_hours || "",
      ticket_url: initialData.ticket_url || "",
      image_url: initialData.image_url || "",
    } : {
      title: "",
      description: "",
      location: "",
      type: "",
      age_range: "",
      price_range: "",
      opening_hours: "",
      ticket_url: "",
      image_url: "",
    },
  });

  const fetchCoordinates = async (location: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=${await getMapboxToken()}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return `(${lng},${lat})`;
      }
      return null;
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  const getMapboxToken = async () => {
    const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
    if (error) throw error;
    return token;
  };

  const onSubmit = async (data: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('Submitting form data:', data);
      console.log('Initial data:', initialData);

      // Fetch coordinates for the location
      const coordinates = await fetchCoordinates(data.location);

      if (initialData) {
        console.log('Updating activity:', initialData.id);
        const { error } = await supabase
          .from('activities')
          .update({
            title: data.title,
            description: data.description,
            location: data.location,
            coordinates: coordinates,
            type: data.type,
            age_range: data.age_range,
            price_range: data.price_range,
            opening_hours: data.opening_hours,
            ticket_url: data.ticket_url,
            image_url: data.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id);

        if (error) {
          console.error('Error updating activity:', error);
          throw error;
        }

        toast({
          title: "Erfolg",
          description: "Aktivität wurde erfolgreich aktualisiert.",
        });
      } else {
        console.log('Creating new activity');
        const { error } = await supabase
          .from('activities')
          .insert({
            ...data,
            coordinates: coordinates,
            created_by: user.id,
          });

        if (error) {
          console.error('Error creating activity:', error);
          throw error;
        }

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
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ActivityBasicInfo form={form} />
        <ActivityTypeInfo form={form} />
        <ActivityImageUpload form={form} />
        <ActivityAdditionalInfo form={form} />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
          )}
          <Button type="submit">
            {initialData ? "Aktivität speichern" : "Aktivität erstellen"}
          </Button>
        </div>
      </form>
    </Form>
  );
}