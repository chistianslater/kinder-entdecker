import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ActivityBasicInfo } from "./form/ActivityBasicInfo";
import { ActivityTypeInfo } from "./form/ActivityTypeInfo";
import { ActivityMediaUpload } from "./form/ActivityMediaUpload";
import { ActivityAdditionalInfo } from "./form/ActivityAdditionalInfo";
import { FormData, formSchema } from "./types";
import { useActivityForm } from "@/hooks/useActivityForm";

interface CreateActivityFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

export function CreateActivityForm({ 
  onSuccess, 
  onCancel, 
  initialData 
}: CreateActivityFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      id: initialData.id,
      title: initialData.title,
      description: initialData.description || "",
      location: initialData.location,
      type: initialData.type,
      age_range: initialData.age_range || "",
      price_range: initialData.price_range || "",
      opening_hours: initialData.opening_hours || "",
      website_url: initialData.website_url || "",
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
      website_url: "",
      ticket_url: "",
      image_url: "",
    },
  });

  const { handleSubmit, isSubmitting } = useActivityForm(onSuccess);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => handleSubmit(data, initialData))} className="space-y-8">
        <ActivityBasicInfo form={form} />
        <ActivityTypeInfo form={form} />
        <ActivityMediaUpload form={form} />
        <ActivityAdditionalInfo form={form} />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="text-white border-white/20 hover:bg-white/10">
              Abbrechen
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Aktivität speichern" : "Aktivität erstellen"}
          </Button>
        </div>
      </form>
    </Form>
  );
}