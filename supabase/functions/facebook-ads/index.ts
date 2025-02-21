
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get credentials from database
    const { data: credentials, error: credentialsError } = await supabaseClient
      .from('facebook_ads_credentials')
      .select('*')
      .maybeSingle()

    console.log('Retrieved credentials:', { ...credentials, access_token: '[REDACTED]' })

    if (credentialsError || !credentials) {
      throw new Error('Failed to retrieve Facebook credentials')
    }

    // Verify access to the ad account first
    const verifyResponse = await fetch(
      'https://graph.facebook.com/v19.0/me/adaccounts',
      {
        headers: {
          Authorization: `Bearer ${credentials.access_token}`,
        },
      }
    )

    if (!verifyResponse.ok) {
      throw new Error(`Failed to verify ad account access: ${await verifyResponse.text()}`)
    }

    const verifyData = await verifyResponse.json()
    console.log('Available ad accounts:', verifyData)

    // Check if the ad account exists in the list
    const validAccount = verifyData.data.some(account => 
      account.id === credentials.ad_account_id || 
      account.id === `act_${credentials.ad_account_id}` ||
      account.id === credentials.ad_account_id.replace('act_', '')
    )

    if (!validAccount) {
      throw new Error(`Ad account ${credentials.ad_account_id} is not accessible with current credentials`)
    }

    // Fetch campaign data
    const campaignsUrl = `https://graph.facebook.com/v19.0/${credentials.ad_account_id}/campaigns?fields=name,objective,status,insights{spend,impressions,clicks,conversions}&date_preset=this_month`
    console.log('Fetching campaigns from:', campaignsUrl)

    const campaignsResponse = await fetch(campaignsUrl, {
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
      },
    })

    if (!campaignsResponse.ok) {
      const errorText = await campaignsResponse.text()
      console.error('Failed to fetch campaigns:', errorText)
      throw new Error(`Failed to fetch campaign data: ${errorText}`)
    }

    const campaigns = await campaignsResponse.json()
    console.log('Raw campaigns response:', campaigns)

    if (!campaigns.data) {
      console.log('No campaigns data in response')
      throw new Error('No campaign data received from Facebook')
    }

    // Process campaigns and ensure proper number formatting
    const processedCampaigns = campaigns.data.map(campaign => {
      let processedCampaign = {
        ...campaign,
        insights: campaign.insights ? {
          data: campaign.insights.data.map(insight => ({
            ...insight,
            spend: parseFloat(insight.spend || '0'),
            impressions: parseInt(insight.impressions || '0', 10),
            clicks: parseInt(insight.clicks || '0', 10),
            conversions: parseInt(insight.conversions || '0', 10)
          }))
        } : { data: [] }
      }

      console.log(`Processed campaign ${campaign.name}:`, processedCampaign)
      return processedCampaign
    })

    console.log('Processed campaigns data:', processedCampaigns)

    return new Response(
      JSON.stringify({ data: processedCampaigns }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
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
        }
      }
    )
  }
})

