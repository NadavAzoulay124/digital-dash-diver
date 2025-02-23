
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  adAccountId: string;
  accessToken: string;
  since?: string;
  until?: string;
  clientName?: string;
  timezone?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData: RequestBody = await req.json();
    console.log('Received request with data:', {
      adAccountId: requestData.adAccountId,
      accessTokenLength: requestData.accessToken?.length || 0,
      since: requestData.since,
      until: requestData.until,
      clientName: requestData.clientName,
      timezone: requestData.timezone
    });

    if (!requestData.adAccountId || !requestData.accessToken) {
      console.error('Missing required credentials');
      throw new Error('Missing required credentials');
    }

    const { adAccountId, accessToken, since, until, timezone } = requestData;

    // Ensure adAccountId starts with 'act_'
    const formattedAdAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
    
    // Construct time range for insights
    const timeRange = {
      since: since,
      until: until,
      timezone_type: 'custom',
      timezone: timezone || 'UTC'
    };
    
    console.log('Using time range:', timeRange);
    
    // Fetch campaigns with insights
    const campaignsUrl = `https://graph.facebook.com/v19.0/${formattedAdAccountId}/campaigns`;
    const insightsFields = 'impressions,clicks,spend,date_start,date_stop';
    
    // Add time_range parameter to insights query
    const campaignFields = `name,objective,status,insights.time_range(${JSON.stringify(timeRange)}){${insightsFields}}`;
    
    console.log('Fetching campaigns from URL:', campaignsUrl);
    console.log('Using fields:', campaignFields);

    const response = await fetch(`${campaignsUrl}?fields=${campaignFields}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Facebook API error:', errorData);
      throw new Error(`Facebook API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Facebook API response:', {
      dataLength: data?.data?.length || 0,
      firstCampaign: data?.data?.[0] ? {
        name: data.data[0].name,
        hasInsights: !!data.data[0].insights,
        timeRange
      } : null
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in facebook-ads function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
