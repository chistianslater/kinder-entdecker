import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { location } = await req.json()
    
    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Location is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY')
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeather API key not configured')
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${OPENWEATHER_API_KEY}`
    
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      console.error('OpenWeather API error:', data)
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to fetch weather data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      )
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in get-weather function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})