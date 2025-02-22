
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const GOOGLE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const REDIRECT_URI = 'https://hxhqzycgpdjzjrowyjxn.supabase.co/functions/v1/google-ads-auth/callback';

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
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    
    // If there's no code, we start the OAuth flow
    if (!code) {
      const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
      if (!clientId) {
        throw new Error('GOOGLE_CLIENT_ID is not set');
      }

      console.log('Starting OAuth flow with client ID:', clientId);

      const state = crypto.randomUUID();
      
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/adwords',
        access_type: 'offline',
        state: state,
        prompt: 'consent'
      });

      return new Response(
        JSON.stringify({ url: `${GOOGLE_OAUTH_URL}?${params.toString()}` }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Handle the OAuth callback
    console.log('Received OAuth callback with code');
    
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      throw new Error('Missing Google OAuth credentials');
    }

    // Exchange the code for tokens
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokens);
      throw new Error('Failed to exchange code for tokens');
    }

    console.log('Successfully obtained tokens');

    return new Response(
      JSON.stringify({ 
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in google-ads-auth function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
