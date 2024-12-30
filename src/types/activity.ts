export interface Activity {
  id: string;
  title: string;
  description: string | null;
  location: string;
  coordinates?: unknown;
  type: string;
  age_range: string | null;
  price_range: string | null;
  opening_hours: string | null;
  created_at: string | null;
  updated_at: string | null;
  is_verified: boolean;
  is_business: boolean;
  website_url: string | null;
  ticket_url: string | null;
  created_by: string | null;
  claimed_by: string | null;
  image_url: string | null;
}