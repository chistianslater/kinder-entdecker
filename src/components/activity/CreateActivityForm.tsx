import React from "react";
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

interface CreateActivityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

type FormData = {
  title: string;
  description: string;
  location: string;
  type: string;
  age_range: string;
  price_range: string;
  opening_hours: string;
};

export function CreateActivityForm({ onSuccess, onCancel }: CreateActivityFormProps) {
  const { toast } = useToast();
  const form = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

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
      onSuccess();
    } catch (error) {
      console.error('Error creating activity:', error);
      toast({
        title: "Fehler",
        description: "Aktivität konnte nicht erstellt werden.",
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
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle einen Typ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle eine Altersgruppe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle eine Preisklasse" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
}