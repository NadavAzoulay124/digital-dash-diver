
import { Campaign } from "@/components/dashboard/types";

interface Metrics {
  totalSpent: number;
  totalResults: number;
  totalClicks: number;
  totalImpressions: number;
  conversionRate: number;
  costPerResult: number;
  costPerClick: number;
  averageFrequency: number;
  previousTotalSpent: number;
  previousTotalResults: number;
  previousConversionRate: number;
  previousCostPerResult: number;
}

export const calculateMetrics = (campaigns: Campaign[]): Metrics => {
  if (!campaigns || !Array.isArray(campaigns)) {
    console.warn('🚨 No campaign data available for metrics calculation');
    return {
      totalSpent: 0,
      totalResults: 0,
      totalClicks: 0,
      totalImpressions: 0,
      conversionRate: 0,
      costPerResult: 0,
      costPerClick: 0,
      averageFrequency: 0,
      previousTotalSpent: 0,
      previousTotalResults: 0,
      previousConversionRate: 0,
      previousCostPerResult: 0
    };
  }

  let totalSpent = 0;
  let totalResults = 0;
  let totalClicks = 0;
  let totalImpressions = 0;
  let totalFrequency = 0;
  let processedInsights = 0;
  let campaignsWithFrequency = 0;

  console.clear(); // Clear previous logs
  console.log('%c=== RAW CAMPAIGN DATA FROM FACEBOOK ===', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Total campaigns received:', campaigns.length);

  // First, show raw campaign data
  console.group('📊 Raw Campaign Data');
  campaigns.forEach((campaign, index) => {
    console.group(`Campaign ${index + 1}: ${campaign.name}`);
    console.log('Full campaign data:', {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      objective: campaign.objective,
      rawInsightsData: campaign.insights?.data || 'No insights available'
    });
    console.groupEnd();
  });
  console.groupEnd();

  // Then show processed metrics
  console.group('💰 Processed Campaign Metrics');
  campaigns.forEach((campaign, index) => {
    console.group(`Campaign ${index + 1}: ${campaign.name}`);
    console.log('Status:', campaign.status);
    
    if (!campaign.insights?.data) {
      console.warn('⚠️ No insights data available');
      console.groupEnd();
      return;
    }

    const insights = campaign.insights.data;
    console.log(`Found ${insights.length} insights entries`);

    let campaignSpent = 0;
    let campaignResults = 0;
    let campaignClicks = 0;
    let campaignImpressions = 0;

    insights.forEach((insight, i) => {
      console.group(`Insight entry ${i + 1}:`);
      
      // Log all fields to debug what's available
      console.log('Raw insight data:', insight);

      // Process basic metrics
      const spent = Number(insight.spend) || 0;
      const clicks = Number(insight.clicks) || 0;
      const impressions = Number(insight.impressions) || 0;
      const frequency = Number(insight.frequency) || 0;

      // Process website purchases (results)
      let results = 0;
      if ('purchase' in insight) {
        results = Number(insight.purchase);
      } else if ('website_purchases' in insight) {
        results = Number(insight.website_purchases);
      } else if ('actions' in insight && Array.isArray(insight.actions)) {
        const purchaseAction = insight.actions.find((action: any) => 
          action.action_type === 'purchase' || 
          action.action_type === 'website_purchase' ||
          action.action_type === 'offsite_conversion.fb_pixel_purchase'
        );
        results = purchaseAction ? Number(purchaseAction.value) : 0;
      }

      console.log('Processed metrics:', {
        spent,
        clicks,
        impressions,
        results,
        frequency,
        date_range: {
          start: insight.date_start,
          end: insight.date_stop
        }
      });

      if (!isNaN(spent)) campaignSpent += spent;
      if (!isNaN(clicks)) campaignClicks += clicks;
      if (!isNaN(impressions)) campaignImpressions += impressions;
      if (!isNaN(results)) campaignResults += results;
      if (!isNaN(frequency) && frequency > 0) {
        totalFrequency += frequency;
        campaignsWithFrequency++;
      }
      processedInsights++;

      console.groupEnd();
    });

    console.log('Campaign Totals:', {
      spent: campaignSpent.toFixed(2),
      clicks: campaignClicks,
      impressions: campaignImpressions,
      results: campaignResults
    });
    console.groupEnd();

    totalSpent += campaignSpent;
    totalClicks += campaignClicks;
    totalImpressions += campaignImpressions;
    totalResults += campaignResults;
  });
  console.groupEnd();

  console.log('\n%c=== FINAL TOTALS ===', 'color: #2196F3; font-weight: bold; font-size: 14px;');
  console.log('💵 Total Spend:', totalSpent.toFixed(2));
  console.log('🖱️ Total Clicks:', totalClicks);
  console.log('👀 Total Impressions:', totalImpressions);
  console.log('🎯 Total Results:', totalResults);
  console.log('🔄 Processed Insights:', processedInsights);
  console.log('===================\n');

  // Calculate derived metrics
  const conversionRate = totalImpressions > 0 ? (totalResults / totalImpressions) * 100 : 0;
  const costPerResult = totalResults > 0 ? totalSpent / totalResults : 0;
  const costPerClick = totalClicks > 0 ? totalSpent / totalClicks : 0;
  const averageFrequency = campaignsWithFrequency > 0 ? totalFrequency / campaignsWithFrequency : 0;

  // Calculate previous period metrics (example: 90% of current values)
  const previousTotalSpent = totalSpent * 0.9;
  const previousTotalResults = Math.round(totalResults * 0.9);
  const previousConversionRate = conversionRate * 0.9;
  const previousCostPerResult = costPerResult * 1.1;

  return {
    totalSpent,
    totalResults,
    totalClicks,
    totalImpressions,
    conversionRate,
    costPerResult,
    costPerClick,
    averageFrequency,
    previousTotalSpent,
    previousTotalResults,
    previousConversionRate,
    previousCostPerResult
  };
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
