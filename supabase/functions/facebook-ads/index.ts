
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
    
    // Construct time range without timezone information
    const timeRange = since && until ? {
      since,
      until
    } : undefined;

    console.log('Using time range:', timeRange);

    // Construct Facebook API URL with all necessary parameters
    const campaignsUrl = `https://graph.facebook.com/v19.0/${formattedAdAccountId}/campaigns`;
    const params = new URLSearchParams({
      access_token: accessToken,
      fields: timeRange 
        ? `${campaignFields},insights.time_range(${JSON.stringify(timeRange)}){${insightsFields}}`
        : `${campaignFields},insights{${insightsFields}}`
    });

    const url = `${campaignsUrl}?${params}`;
    console.log('Fetching from URL:', url.replace(accessToken, '[REDACTED]'));

    const response = await fetch(url);
    const responseData = await response.json();

    if (!response.ok) {
      console.error('Facebook API error:', responseData);
      throw new Error(`Facebook API error: ${JSON.stringify(responseData.error || responseData)}`);
    }

    // Log the successful response data structure
    console.log('Facebook API response structure:', {
      totalCampaigns: responseData?.data?.length || 0,
      hasData: !!responseData?.data,
      firstCampaign: responseData?.data?.[0] ? {
        name: responseData.data[0].name,
        hasInsights: !!responseData.data[0].insights,
        timeRange
      } : null
    });

    return new Response(JSON.stringify(responseData), {
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

