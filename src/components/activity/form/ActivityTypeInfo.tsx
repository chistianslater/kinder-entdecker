import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../types";

interface ActivityTypeInfoProps {
  form: UseFormReturn<FormData>;
}

export function ActivityTypeInfo({ form }: ActivityTypeInfoProps) {
  return (
    <>
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
    </>
  );
}