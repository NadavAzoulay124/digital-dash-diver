
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get credentials from the database
    const { data: credentials, error: credentialsError } = await supabaseClient
      .from('facebook_ads_credentials')
      .select('*')
      .maybeSingle()

    if (credentialsError) throw new Error('Failed to fetch credentials')
    if (!credentials) throw new Error('No Facebook credentials found')

    console.log('Attempting to fetch campaigns for account:', credentials.ad_account_id)

    // First verify the access token and ad account are valid
    const verifyResponse = await fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?access_token=${credentials.access_token}`
    )

    if (!verifyResponse.ok) {
      const error = await verifyResponse.json()
      console.error('Access token validation error:', error)
      throw new Error(`Facebook API authentication error: ${error.error?.message || 'Unknown error'}`)
    }

    const verifyData = await verifyResponse.json()
    console.log('Available ad accounts:', verifyData)

    // Check if the ad account exists in the list - without act_ prefix
    const validAccount = verifyData.data.some(account => 
      account.id === credentials.ad_account_id || 
      account.id === credentials.ad_account_id.replace('act_', '')
    )

    if (!validAccount) {
      throw new Error(`Ad account ${credentials.ad_account_id} is not accessible with current credentials`)
    }

    // If verification passed, fetch campaign data - using the ID without act_ prefix
    const campaignsResponse = await fetch(
      `https://graph.facebook.com/v19.0/${credentials.ad_account_id}/campaigns?fields=name,objective,status,insights{spend,impressions,clicks,conversions}&date_preset=this_month`,
      {
        headers: {
          Authorization: `Bearer ${credentials.access_token}`,
        },
      }
    )

    if (!campaignsResponse.ok) {
      const error = await campaignsResponse.json()
      console.error('Campaign fetch error:', error)
      throw new Error(`Failed to fetch campaigns: ${error.error?.message || 'Unknown error'}`)
    }

    const campaigns = await campaignsResponse.json()
    console.log('Raw campaigns data from Facebook:', campaigns)

    if (!campaigns.data || !Array.isArray(campaigns.data)) {
      console.error('Invalid campaigns response format:', campaigns)
      throw new Error('Invalid response format from Facebook API')
    }

    // Process campaigns to ensure proper number formatting for spend
    const processedCampaigns = campaigns.data.map(campaign => {
      if (campaign.insights && campaign.insights.data && campaign.insights.data[0]) {
        console.log(`Processing campaign ${campaign.name}:`, campaign)
      }
      return campaign
    })

    return new Response(
      JSON.stringify({ data: processedCampaigns }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error) {
    console.error('Error in facebook-ads function:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})

