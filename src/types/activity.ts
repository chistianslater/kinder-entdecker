export interface Activity {
  id: string;
  title: string;
  description: string | null;
  location: string;
  coordinates?: { x: number; y: number } | null;
  type: string[];  // Changed from string to string[]
  age_range: string[] | null;  // Changed from string to string[]
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
  approved_at: string | null;
  approved_by: string | null;
}