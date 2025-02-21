
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Loading Facebook Ads Edge Function")

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get credentials from database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: credentials, error: credentialsError } = await supabaseClient
      .from('facebook_ads_credentials')
      .select('*')
      .maybeSingle()

    if (credentialsError) throw new Error('Failed to fetch credentials')
    if (!credentials) throw new Error('No Facebook credentials found')

    console.log('Fetching campaigns with credentials:', credentials.ad_account_id)

    // Fetch active campaigns
    const campaignsResponse = await fetch(
      `https://graph.facebook.com/v19.0/${credentials.ad_account_id}/campaigns?fields=name,objective,status,insights{spend,impressions,clicks,conversions}&date_preset=last_30d`,
      {
        headers: {
          Authorization: `Bearer ${credentials.access_token}`,
        },
      }
    )

    if (!campaignsResponse.ok) {
      const error = await campaignsResponse.json()
      console.error('Facebook API error:', error)
      throw new Error(`Facebook API error: ${error.error?.message || 'Unknown error'}`)
    }

    const campaigns = await campaignsResponse.json()
    console.log('Fetched campaigns:', campaigns)

    // Process campaigns to ensure proper number formatting for spend
    const processedCampaigns = campaigns.data.map(campaign => ({
      ...campaign,
      insights: campaign.insights ? {
        data: campaign.insights.data.map(insight => ({
          ...insight,
          spend: parseFloat(insight.spend || '0').toFixed(2), // Ensure spend is formatted as number with 2 decimal places
          impressions: parseInt(insight.impressions || '0'),
          clicks: parseInt(insight.clicks || '0'),
          conversions: parseInt(insight.conversions || '0')
        }))
      } : null
    }))

    return new Response(
      JSON.stringify({ data: processedCampaigns }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error in facebook-ads function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})

// Helper to create Supabase client (This needs to be here since edge functions can't import from src/)
const createClient = (supabaseUrl: string, supabaseKey: string) => {
  return {
    from: (table: string) => ({
      select: (query: string) => ({
        maybeSingle: async () => {
          const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${query}`, {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            }
          })
          const data = await response.json()
          return { data: data[0], error: null }
        }
      })
    })
  }
}
