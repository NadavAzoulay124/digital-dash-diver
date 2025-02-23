
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID') || '';
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET') || '';
const GOOGLE_OAUTH_REDIRECT_URI = Deno.env.get('GOOGLE_OAUTH_REDIRECT_URI') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json().catch(() => ({}));

    // If no code is provided, initiate OAuth flow
    if (!code) {
      console.log('Initiating OAuth flow...');
      // OAuth 2.0 configuration
      const scope = encodeURIComponent('https://www.googleapis.com/auth/adwords');
      const responseType = 'code';
      const accessType = 'offline';
      const prompt = 'consent';

      // Construct the authorization URL
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_OAUTH_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(GOOGLE_OAUTH_REDIRECT_URI)}&` +
        `response_type=${responseType}&` +
        `scope=${scope}&` +
        `access_type=${accessType}&` +
        `prompt=${prompt}`;

      console.log('Generated auth URL:', authUrl);

      return new Response(
        JSON.stringify({ url: authUrl }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Exchange code for tokens
    console.log('Exchanging code for tokens...');
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_OAUTH_CLIENT_ID,
        client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: GOOGLE_OAUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Token exchange response:', tokenData);

    if (!tokenResponse.ok) {
      console.error('Token exchange error:', tokenData);
      throw new Error('Failed to exchange authorization code for tokens');
    }

    return new Response(
      JSON.stringify(tokenData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in Google Ads auth function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
