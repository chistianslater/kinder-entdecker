import mapboxgl from 'mapbox-gl';
import { supabase } from "@/integrations/supabase/client";

export const initializeMap = async (container: HTMLDivElement) => {
  try {
    const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
    if (error) throw error;
    
    mapboxgl.accessToken = token;
    
    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/dark-v11', // Changed to dark style
      center: [10.4515, 51.1657],
      zoom: 5.5
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    return map;
  } catch (error) {
    console.error('Error initializing map:', error);
    throw error;
  }
};