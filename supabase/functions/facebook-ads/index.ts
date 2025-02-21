
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Facebook ads data fetch')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the JWT from the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get the user from the JWT
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))

    if (userError) {
      console.error('User auth error:', userError)
      throw userError
    }
    if (!user) {
      console.error('No user found')
      throw new Error('User not found')
    }

    console.log('Fetching Facebook credentials for user:', user.id)

    // Get user's Facebook credentials
    const { data: credentials, error: credentialsError } = await supabase
      .from('facebook_ads_credentials')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (credentialsError) {
      console.error('Credentials fetch error:', credentialsError)
      throw credentialsError
    }
    if (!credentials) {
      console.error('No Facebook credentials found for user')
      throw new Error('Facebook credentials not found')
    }

    console.log('Making request to Facebook API')

    // Make the API call to Facebook
    const fbResponse = await fetch(
      `https://graph.facebook.com/v19.0/act_${credentials.ad_account_id}/campaigns?fields=name,objective,status,insights{impressions,clicks,conversions}&access_token=${credentials.access_token}`
    )

    if (!fbResponse.ok) {
      const error = await fbResponse.json()
      console.error('Facebook API error:', error)
      throw new Error(`Facebook API error: ${JSON.stringify(error)}`)
    }

    const campaigns = await fbResponse.json()
    console.log('Successfully fetched campaigns:', campaigns)
    
    return new Response(JSON.stringify(campaigns), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in facebook-ads function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

