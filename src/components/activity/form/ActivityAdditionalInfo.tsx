import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../types";

interface ActivityAdditionalInfoProps {
  form: UseFormReturn<FormData>;
}

export function ActivityAdditionalInfo({ form }: ActivityAdditionalInfoProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="opening_hours"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Öffnungszeiten</FormLabel>
            <FormControl>
              <Input {...field} placeholder="z.B. Mo-Fr 9-17 Uhr" className="text-white placeholder:text-gray-400 bg-accent border-accent" />
            </FormControl>
            <FormMessage className="text-white" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="website_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Website URL</FormLabel>
            <FormControl>
              <Input {...field} type="url" placeholder="https://..." className="text-white placeholder:text-gray-400 bg-accent border-accent" />
            </FormControl>
            <FormMessage className="text-white" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ticket_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Ticket URL</FormLabel>
            <FormControl>
              <Input {...field} type="url" placeholder="https://..." className="text-white placeholder:text-gray-400 bg-accent border-accent" />
            </FormControl>
            <FormMessage className="text-white" />
          </FormItem>
        )}
      />
    </>
  );
}