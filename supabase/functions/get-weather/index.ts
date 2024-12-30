import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    console.log('Fetching weather for location:', location);

    // Extract city name from location string (take first part before comma)
    const city = location.split(',')[0].trim();
    console.log('Using city:', city);

    // First, get coordinates from location name
    const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    const geocodeResponse = await fetch(geocodeUrl);
    
    if (!geocodeResponse.ok) {
      throw new Error(`Geocoding API error: ${geocodeResponse.statusText}`);
    }
    
    const geocodeData = await geocodeResponse.json();
    console.log('Geocode data:', geocodeData);

    if (!geocodeData.length) {
      return new Response(
        JSON.stringify({ 
          error: 'Location not found',
          weather: [{ id: 800 }], // Default to clear weather
          main: { temp: null }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return 200 but with null data
        }
      );
    }

    const { lat, lon } = geocodeData[0];

    // Then, get weather data using coordinates
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=de&appid=${OPENWEATHER_API_KEY}`;
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.statusText}`);
    }
    
    const weatherData = await weatherResponse.json();
    console.log('Weather data received:', weatherData);

    return new Response(
      JSON.stringify(weatherData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error fetching weather:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        weather: [{ id: 800 }], // Default to clear weather
        main: { temp: null }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 but with fallback data
      }
    );
  }
});