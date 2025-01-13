import { supabase } from "@/integrations/supabase/client";

export async function fetchCoordinates(location: string): Promise<string | null> {
  try {
    const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
    if (error) throw error;

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        location
      )}.json?access_token=${token}`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return `(${lng},${lat})`; // Return coordinates in PostgreSQL point format
    }
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
}