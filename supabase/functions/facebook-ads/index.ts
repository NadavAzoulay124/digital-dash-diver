
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
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData: RequestBody = await req.json();
    console.log('Received request:', {
      adAccountId: requestData.adAccountId,
      hasAccessToken: !!requestData.accessToken,
      since: requestData.since,
      until: requestData.until,
      clientName: requestData.clientName
    });

    if (!requestData.adAccountId || !requestData.accessToken) {
      throw new Error('Missing required credentials');
    }

    const { adAccountId, accessToken, since, until } = requestData;

    // Ensure adAccountId starts with 'act_'
    const formattedAdAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
    
    // Construct the insights fields we want to retrieve
    const insightsFields = 'spend,clicks,impressions';
    
    // Add campaign status and name to fetch
    const campaignFields = 'name,objective,status';

    // Construct Facebook API URL with all necessary parameters
    const campaignsUrl = `https://graph.facebook.com/v19.0/${formattedAdAccountId}/campaigns`;
    const fields = `${campaignFields}`;
    const insightsParam = since && until 
      ? `insights.time_range({"since":"${since}","until":"${until}"}){${insightsFields}}`
      : `insights{${insightsFields}}`;
    
    const params = new URLSearchParams({
      access_token: accessToken,
      fields: `${fields},${insightsParam}`
    });

    const url = `${campaignsUrl}?${params}`;
    console.log('Fetching from URL:', url.replace(accessToken, '[REDACTED]'));

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('Facebook API error:', data);
      throw new Error(`Facebook API error: ${JSON.stringify(data.error || data)}`);
    }

    // Log the successful response data structure
    console.log('Facebook API response structure:', {
      totalCampaigns: data?.data?.length || 0,
      hasData: !!data?.data,
      firstCampaign: data?.data?.[0] ? {
        name: data.data[0].name,
        hasInsights: !!data.data[0].insights,
        insightsData: data.data[0].insights?.data?.[0]
      } : null
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in facebook-ads function:', error);
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Internal server error',
          details: error.toString(),
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

