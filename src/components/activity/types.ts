import * as z from "zod";

export const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Titel ist erforderlich"),
  description: z.string().optional(),
  location: z.string().min(1, "Standort ist erforderlich"),
  type: z.string().min(1, "Typ ist erforderlich"),
  age_range: z.string().optional(),
  price_range: z.string().optional(),
  opening_hours: z.string().optional(),
  ticket_url: z.string().optional(),
  image_url: z.string().optional(),
  coordinates: z.object({
    x: z.number(),
    y: z.number()
  }).optional(),
});

export type FormData = z.infer<typeof formSchema>;