
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get credentials from database using auth
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user's Facebook credentials
    const { data: credentials, error: credError } = await supabaseClient
      .from('facebook_ads_credentials')
      .select('*')
      .single();

    if (credError || !credentials) {
      console.error('Error fetching credentials:', credError);
      return new Response(
        JSON.stringify({ error: 'No Facebook credentials found' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Facebook Marketing API
    const fbResponse = await fetch(
      `https://graph.facebook.com/v19.0/${credentials.ad_account_id}/campaigns?fields=name,objective,status,insights{impressions,clicks,conversions}&access_token=${credentials.access_token}`
    );

    if (!fbResponse.ok) {
      const fbError = await fbResponse.json();
      console.error('Facebook API error:', fbError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch Facebook campaigns' }), 
        { status: fbResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await fbResponse.json();
    console.log('Facebook API response:', data);

    return new Response(
      JSON.stringify({ data }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Required Supabase imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
