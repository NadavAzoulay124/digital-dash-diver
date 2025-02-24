
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
      clientName: requestData.clientName,
      timestamp: new Date().toISOString()
    });

    if (!requestData.adAccountId || !requestData.accessToken) {
      throw new Error('Missing required credentials');
    }

    const { adAccountId, accessToken, since, until } = requestData;

    // Ensure adAccountId starts with 'act_'
    const formattedAdAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
    
    // Define basic fields for insights
    const insightsFields = [
      'spend',
      'clicks',
      'impressions'
    ].join(',');
    
    // Define basic fields for campaigns
    const campaignFields = [
      'name',
      'objective',
      'status'
    ].join(',');

    // Construct the base URL
    const baseUrl = `https://graph.facebook.com/v19.0/${formattedAdAccountId}/campaigns`;
    const params = new URLSearchParams();
    params.append('access_token', accessToken);
    
    // Add fields parameter with time range if specified
    let fields = `${campaignFields},insights{${insightsFields}}`;
    if (since && until) {
      const timeRange = JSON.stringify({ since, until });
      fields = `${campaignFields},insights.time_range(${timeRange}){${insightsFields}}`;
    }
    
    params.append('fields', fields);

    const url = `${baseUrl}?${params}`;
    console.log('Making request to Facebook API:', {
      url: url.replace(accessToken, '[REDACTED]'),
      since,
      until,
      timestamp: new Date().toISOString()
    });

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('Facebook API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error || data,
        timestamp: new Date().toISOString()
      });
      throw new Error(`Facebook API error: ${JSON.stringify(data.error || data)}`);
    }

    if (data.error) {
      console.error('Facebook API returned error in response body:', {
        error: data.error,
        timestamp: new Date().toISOString()
      });
      throw new Error(`Facebook API error: ${JSON.stringify(data.error)}`);
    }

    console.log('Facebook API response:', {
      timestamp: new Date().toISOString(),
      campaignsCount: data?.data?.length || 0,
      sampleCampaign: data?.data?.[0] ? {
        name: data.data[0].name,
        status: data.data[0].status,
        hasInsights: !!data.data[0].insights
      } : null
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in facebook-ads function:', {
      error: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Internal server error',
          details: error.toString()
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
