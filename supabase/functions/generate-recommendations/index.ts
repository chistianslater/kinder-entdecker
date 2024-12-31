import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id } = await req.json();

    // Get user preferences
    const { data: preferences } = await supabaseClient
      .from('user_preferences')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (!preferences) {
      throw new Error('User preferences not found');
    }

    // Get all activities
    const { data: activities } = await supabaseClient
      .from('activities')
      .select('*');

    if (!activities) {
      throw new Error('No activities found');
    }

    // Calculate scores for each activity
    const recommendations = activities.map(activity => {
      let score = 0;
      let reasons = [];

      // Score based on interests
      if (preferences.interests.some(interest => 
        activity.type.toLowerCase().includes(interest.toLowerCase()))) {
        score += 0.3;
        reasons.push(`Matches your interests in ${activity.type}`);
      }

      // Score based on age range
      if (preferences.child_age_ranges.some(range => 
        activity.age_range?.includes(range))) {
        score += 0.3;
        reasons.push('Suitable for your children\'s age');
      }

      // Score based on accessibility needs
      const accessibilityMatch = preferences.accessibility_needs.filter(need => 
        activity.description?.toLowerCase().includes(need.toLowerCase())).length;
      if (accessibilityMatch > 0) {
        score += 0.2 * (accessibilityMatch / preferences.accessibility_needs.length);
        reasons.push('Meets accessibility requirements');
      }

      return {
        activity_id: activity.id,
        user_id,
        score,
        reason: reasons.join('. ')
      };
    });

    // Sort recommendations by score
    const topRecommendations = recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Store recommendations in the database
    const { error } = await supabaseClient
      .from('ai_recommendations')
      .upsert(topRecommendations);

    if (error) throw error;

    console.log(`Generated ${topRecommendations.length} recommendations for user ${user_id}`);

    return new Response(
      JSON.stringify({ success: true, recommendations: topRecommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});