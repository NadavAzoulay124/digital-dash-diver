
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the JWT from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get the user from the JWT
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Get the Facebook credentials for this user
    const { data: credentials, error: credentialsError } = await supabaseClient
      .from('facebook_ads_credentials')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (credentialsError || !credentials) {
      throw new Error('Facebook credentials not found');
    }

    // Make the request to Facebook's API
    const facebookApiUrl = `https://graph.facebook.com/v18.0/act_${credentials.ad_account_id}/campaigns`;
    const response = await fetch(`${facebookApiUrl}?access_token=${credentials.access_token}&fields=name,objective,status,lifetime_budget`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Facebook API error:', errorData);
      throw new Error(`Facebook API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error in facebook-ads function:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
