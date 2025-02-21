
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

    if (credError) {
      console.error('Error fetching credentials:', credError);
      return new Response(
        JSON.stringify({ error: 'No Facebook credentials found' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!credentials) {
      console.log('No Facebook credentials found for user');
      return new Response(
        JSON.stringify({ data: [] }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching campaigns for account:', credentials.ad_account_id);

    // Call Facebook Marketing API
    const fbResponse = await fetch(
      `https://graph.facebook.com/v19.0/act_${credentials.ad_account_id}/campaigns?fields=name,objective,status,insights{impressions,clicks,conversions,spend}&access_token=${credentials.access_token}`
    );

    if (!fbResponse.ok) {
      const fbError = await fbResponse.json();
      console.error('Facebook API error:', fbError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch Facebook campaigns', details: fbError }), 
        { status: fbResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fbData = await fbResponse.json();
    console.log('Successfully fetched Facebook campaigns:', fbData);

    return new Response(
      JSON.stringify({ data: fbData.data || [] }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Required Supabase imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
