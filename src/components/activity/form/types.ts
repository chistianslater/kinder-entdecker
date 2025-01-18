import { z } from "zod";

export const activityFormSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  location: z.string(),
  coordinates: z.object({
    x: z.number(),
    y: z.number()
  }).optional(),
  type: z.array(z.string()),
  age_range: z.array(z.string()).optional(),
  price_range: z.string().optional(),
  opening_hours: z.string().optional(),
  website_url: z.string().optional(),
  ticket_url: z.string().optional(),
  image_url: z.string().optional(),
});

export type ActivityFormData = z.infer<typeof activityFormSchema>;