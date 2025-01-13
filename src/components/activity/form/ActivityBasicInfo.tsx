import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../types";
import { LocationAutocomplete } from "./LocationAutocomplete";

interface ActivityBasicInfoProps {
  form: UseFormReturn<FormData>;
}

export function ActivityBasicInfo({ form }: ActivityBasicInfoProps) {
  return (
    <>
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
              <LocationAutocomplete
                value={field.value}
                onChange={(value, coordinates) => {
                  field.onChange(value);
                  // Store coordinates in form data if needed
                  if (coordinates) {
                    form.setValue('coordinates', coordinates);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}