import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Activity } from "@/types/activity";
import { ActivityBasicInfo } from "./form/ActivityBasicInfo";
import { ActivityTypeInfo } from "./form/ActivityTypeInfo";
import { ActivityImageUpload } from "./form/ActivityImageUpload";
import { ActivityAdditionalInfo } from "./form/ActivityAdditionalInfo";
import { FormData } from "./types";

interface CreateActivityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Activity;
}

export function CreateActivityForm({ onSuccess, onCancel, initialData }: CreateActivityFormProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
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

  const onSubmit = async (data: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('Submitting form data:', data);
      console.log('Initial data:', initialData);

      if (initialData) {
        console.log('Updating activity:', initialData.id);
        const { error } = await supabase
          .from('activities')
          .update({
            title: data.title,
            description: data.description,
            location: data.location,
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

      onSuccess();
    } catch (error) {
      console.error('Error saving activity:', error);
      toast({
        title: "Fehler",
        description: "Aktivität konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ActivityBasicInfo form={form} />
        <ActivityTypeInfo form={form} />
        <ActivityAdditionalInfo form={form} />
        <ActivityImageUpload form={form} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button type="submit">
            {initialData ? "Aktivität speichern" : "Aktivität erstellen"}
          </Button>
        </div>
      </form>
    </Form>
  );
}