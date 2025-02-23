
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
    
    // Define fields for insights
    const insightsFields = [
      'spend',
      'clicks',
      'impressions'
    ].join(',');
    
    // Define fields for campaigns
    const campaignFields = [
      'name',
      'objective',
      'status'
    ].join(',');

    // Construct the insights time_range parameter
    const timeRange = since && until ? JSON.stringify({ since, until }) : undefined;
    
    // Construct the full URL with parameters
    const baseUrl = `https://graph.facebook.com/v19.0/${formattedAdAccountId}/campaigns`;
    const params = new URLSearchParams();
    params.append('access_token', accessToken);
    
    // Add fields parameter with proper insights time range
    const fields = timeRange
      ? `${campaignFields},insights.time_range(${timeRange}){${insightsFields}}`
      : `${campaignFields},insights{${insightsFields}}`;
    
    params.append('fields', fields);

    const url = `${baseUrl}?${params}`;
    console.log('Making request to Facebook API:', {
      url: url.replace(accessToken, '[REDACTED]'),
      timeRange: timeRange ? JSON.parse(timeRange) : 'default',
      fields: fields.split(',')
    });

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('Facebook API error:', data);
      throw new Error(`Facebook API error: ${JSON.stringify(data.error || data)}`);
    }

    console.log('Facebook API response summary:', {
      timestamp: new Date().toISOString(),
      campaignsCount: data?.data?.length || 0,
      sampleData: data?.data?.[0] ? {
        name: data.data[0].name,
        status: data.data[0].status,
        hasInsights: !!data.data[0].insights,
        insightsSample: data.data[0].insights?.data?.[0]
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

