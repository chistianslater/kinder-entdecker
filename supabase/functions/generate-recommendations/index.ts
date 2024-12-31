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
    console.log(`Generating recommendations for user ${user_id}`);

    // Get user preferences
    const { data: preferences, error: preferencesError } = await supabaseClient
      .from('user_preferences')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (preferencesError) {
      console.error('Error fetching preferences:', preferencesError);
      throw new Error('User preferences not found');
    }

    // Get all activities
    const { data: activities, error: activitiesError } = await supabaseClient
      .from('activities')
      .select('*');

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
      throw new Error('No activities found');
    }

    // Delete existing recommendations for this user
    const { error: deleteError } = await supabaseClient
      .from('ai_recommendations')
      .delete()
      .eq('user_id', user_id);

    if (deleteError) {
      console.error('Error deleting existing recommendations:', deleteError);
      throw deleteError;
    }

    console.log(`Deleted existing recommendations for user ${user_id}`);

    // Calculate scores for each activity
    const recommendations = activities.map(activity => {
      let score = 0;
      let reasons = [];

      // Score based on interests
      if (preferences.interests?.some(interest => 
        activity.type.toLowerCase().includes(interest.toLowerCase()))) {
        score += 0.3;
        reasons.push(`Matches your interests in ${activity.type}`);
      }

      // Score based on age range
      if (preferences.child_age_ranges?.some(range => 
        activity.age_range?.includes(range))) {
        score += 0.3;
        reasons.push('Suitable for your children\'s age');
      }

      // Score based on accessibility needs
      const accessibilityMatch = preferences.accessibility_needs?.filter(need => 
        activity.description?.toLowerCase().includes(need.toLowerCase())).length || 0;
      if (accessibilityMatch > 0) {
        score += 0.2 * (accessibilityMatch / (preferences.accessibility_needs?.length || 1));
        reasons.push('Meets accessibility requirements');
      }

      return {
        activity_id: activity.id,
        user_id,
        score,
        reason: reasons.join('. ')
      };
    });

    // Sort recommendations by score and take top 10
    const topRecommendations = recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .filter(rec => rec.score > 0); // Only include recommendations with a positive score

    if (topRecommendations.length === 0) {
      console.log('No matching recommendations found');
      return new Response(
        JSON.stringify({ success: true, recommendations: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store recommendations in the database
    const { error: insertError } = await supabaseClient
      .from('ai_recommendations')
      .insert(topRecommendations);

    if (insertError) {
      console.error('Error inserting recommendations:', insertError);
      throw insertError;
    }

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