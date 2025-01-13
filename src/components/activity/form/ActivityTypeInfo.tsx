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
            <FormLabel className="text-white">Typ</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-accent border-accent text-white">
                  <SelectValue placeholder="Wähle einen Typ" className="text-gray-400" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-accent border-accent">
                <SelectItem value="outdoor" className="text-white">Outdoor</SelectItem>
                <SelectItem value="indoor" className="text-white">Indoor</SelectItem>
                <SelectItem value="education" className="text-white">Bildung</SelectItem>
                <SelectItem value="sports" className="text-white">Sport</SelectItem>
                <SelectItem value="arts" className="text-white">Kunst & Kultur</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="text-white" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age_range"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Altersgruppe</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-accent border-accent text-white">
                  <SelectValue placeholder="Wähle eine Altersgruppe" className="text-gray-400" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-accent border-accent">
                <SelectItem value="0-3" className="text-white">0-3 Jahre</SelectItem>
                <SelectItem value="4-6" className="text-white">4-6 Jahre</SelectItem>
                <SelectItem value="7-12" className="text-white">7-12 Jahre</SelectItem>
                <SelectItem value="13-16" className="text-white">13-16 Jahre</SelectItem>
                <SelectItem value="all" className="text-white">Alle Altersgruppen</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="text-white" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price_range"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Preisklasse</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-accent border-accent text-white">
                  <SelectValue placeholder="Wähle eine Preisklasse" className="text-gray-400" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-accent border-accent">
                <SelectItem value="free" className="text-white">Kostenlos</SelectItem>
                <SelectItem value="low" className="text-white">Günstig</SelectItem>
                <SelectItem value="medium" className="text-white">Mittel</SelectItem>
                <SelectItem value="high" className="text-white">Hochpreisig</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="text-white" />
          </FormItem>
        )}
      />
    </>
  );
}