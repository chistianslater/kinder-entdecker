import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Fetch data from DZT API
    const response = await fetch('https://www.germany.travel/api/v1/attractions', {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DZT_API_KEY')}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`DZT API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Transform data to match our activities schema
    const transformedData = data.items.map((item: any) => ({
      title: item.name,
      description: item.description,
      location: `${item.city}, Deutschland`,
      type: item.category,
      age_range: 'Alle Altersgruppen', // Default value as DZT doesn't provide age ranges
      price_range: item.price_range || 'Preis auf Anfrage',
      opening_hours: item.opening_hours || 'Öffnungszeiten auf Anfrage',
      is_verified: true,
      is_business: true,
      website_url: item.website,
      image_url: item.image_url,
    }))

    // Log the number of items processed
    console.log(`Processed ${transformedData.length} attractions from DZT API`)

    return new Response(
      JSON.stringify(transformedData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching DZT data:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    )
  }
})