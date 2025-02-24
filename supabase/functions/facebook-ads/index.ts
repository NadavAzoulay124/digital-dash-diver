
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
    
    // Define fields for insights with detailed metrics
    const insightsFields = [
      'spend',
      'clicks',
      'impressions',
      'frequency',
      'date_start',
      'date_stop',
      'actions',
      'action_values',
      'conversions',
      'conversion_values'
    ].join(',');
    
    // Define fields for campaigns
    const campaignFields = [
      'name',
      'objective',
      'status',
      'effective_status'
    ].join(',');

    // Construct the base URL
    const baseUrl = `https://graph.facebook.com/v19.0/${formattedAdAccountId}/campaigns`;
    const params = new URLSearchParams();
    params.append('access_token', accessToken);

    // Define time range for insights
    const timeRange = since && until ? {
      since,
      until,
      time_increment: 1  // Get daily data
    } : undefined;

    // Add fields parameter with time range if specified
    const fields = timeRange
      ? `${campaignFields},insights.time_range(${JSON.stringify(timeRange)}){${insightsFields}}`
      : `${campaignFields},insights{${insightsFields}}`;
    
    params.append('fields', fields);
    params.append('limit', '1000'); // Increase limit to get more campaigns

    const url = `${baseUrl}?${params}`;
    console.log('Making request to Facebook API:', {
      url: url.replace(accessToken, '[REDACTED]'),
      timeRange: timeRange || 'default',
      fields: fields.split(','),
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

    // Log a sample of the data to debug insights
    console.log('Facebook API response summary:', {
      timestamp: new Date().toISOString(),
      campaignsCount: data?.data?.length || 0,
      sampleData: data?.data?.[0] ? {
        name: data.data[0].name,
        status: data.data[0].status,
        effectiveStatus: data.data[0].effective_status,
        objective: data.data[0].objective,
        hasInsights: !!data.data[0].insights,
        insightsSample: data.data[0].insights?.data?.[0]
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
