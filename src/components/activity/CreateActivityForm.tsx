import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { Activity } from "@/types/activity";

interface CreateActivityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Activity;
}

type FormData = {
  title: string;
  description: string;
  location: string;
  type: string;
  age_range: string;
  price_range: string;
  opening_hours: string;
  ticket_url?: string;
  image_url?: string;
};

export function CreateActivityForm({ onSuccess, onCancel, initialData }: CreateActivityFormProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormData>({
    defaultValues: initialData || {
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('activity-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('activity-photos')
        .getPublicUrl(filePath);

      form.setValue('image_url', publicUrl);
      
      toast({
        title: "Erfolg",
        description: "Bild wurde erfolgreich hochgeladen.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Fehler",
        description: "Bild konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (initialData) {
        // Update existing activity
        const { error } = await supabase
          .from('activities')
          .update(data)
          .eq('id', initialData.id)
          .eq('created_by', user.id); // Ensure user owns the activity

        if (error) throw error;

        toast({
          title: "Erfolg",
          description: "Aktivität wurde erfolgreich aktualisiert.",
        });
      } else {
        // Create new activity
        const { error } = await supabase
          .from('activities')
          .insert({
            ...data,
            created_by: user.id,
          });

        if (error) throw error;

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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Name der Aktivität" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschreibung</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Beschreibe die Aktivität" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Standort</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Adresse oder Standort" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Wähle einen Typ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background">
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                  <SelectItem value="indoor">Indoor</SelectItem>
                  <SelectItem value="education">Bildung</SelectItem>
                  <SelectItem value="sports">Sport</SelectItem>
                  <SelectItem value="arts">Kunst & Kultur</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Altersgruppe</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Wähle eine Altersgruppe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background">
                  <SelectItem value="0-3">0-3 Jahre</SelectItem>
                  <SelectItem value="4-6">4-6 Jahre</SelectItem>
                  <SelectItem value="7-12">7-12 Jahre</SelectItem>
                  <SelectItem value="13-16">13-16 Jahre</SelectItem>
                  <SelectItem value="all">Alle Altersgruppen</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preisklasse</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Wähle eine Preisklasse" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background">
                  <SelectItem value="free">Kostenlos</SelectItem>
                  <SelectItem value="low">Günstig</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="high">Hochpreisig</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="opening_hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Öffnungszeiten</FormLabel>
              <FormControl>
                <Input {...field} placeholder="z.B. Mo-Fr 9-17 Uhr" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ticket_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" placeholder="https://..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bild</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value && (
                    <img 
                      src={field.value} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <Input {...field} type="url" placeholder="Bild URL" />
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      <Button type="button" variant="outline" disabled={uploading}>
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Lädt...' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button type="submit">
            Aktivität erstellen
          </Button>
        </div>
      </form>
    </Form>
  );
};
