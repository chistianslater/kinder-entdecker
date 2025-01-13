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
            <FormLabel className="text-white">Titel</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Name der Aktivität" className="text-white placeholder:text-gray-400 bg-accent border-accent" />
            </FormControl>
            <FormMessage className="text-white" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Beschreibung</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Beschreibe die Aktivität" className="text-white placeholder:text-gray-400 bg-accent border-accent" />
            </FormControl>
            <FormMessage className="text-white" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Standort</FormLabel>
            <FormControl>
              <LocationAutocomplete
                value={field.value}
                onChange={(value, coordinates) => {
                  field.onChange(value);
                  if (coordinates) {
                    form.setValue('coordinates', coordinates);
                  }
                }}
              />
            </FormControl>
            <FormMessage className="text-white" />
          </FormItem>
        )}
      />
    </>
  );
}