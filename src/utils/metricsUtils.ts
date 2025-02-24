
import { Campaign } from "@/components/dashboard/types";

interface Metrics {
  totalSpent: number;
  totalResults: number;
  conversionRate: number;
  costPerResult: number;
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
      conversionRate: 0,
      costPerResult: 0,
      previousTotalSpent: 0,
      previousTotalResults: 0,
      previousConversionRate: 0,
      previousCostPerResult: 0
    };
  }

  let totalSpent = 0;
  let totalResults = 0;
  let processedInsights = 0;

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

    insights.forEach((insight, i) => {
      console.group(`Insight entry ${i + 1}:`);
      
      // Log all fields to debug what's available
      console.log('All available fields:', insight);
      
      console.log('Date range:', {
        start: insight.date_start,
        end: insight.date_stop
      });

      const spent = Number(insight.spend) || 0;
      
      // Try different possible field names for website purchases
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

      console.log('Processed values:', {
        spend: spent,
        results: results,
        rawSpend: insight.spend,
        foundPurchaseData: results > 0 ? 'yes' : 'no'
      });
      
      if (!isNaN(spent) && !isNaN(results)) {
        campaignSpent += spent;
        campaignResults += results;
        processedInsights++;
      }
      console.groupEnd();
    });

    console.log('Campaign Totals:', {
      spent: campaignSpent.toFixed(2),
      results: campaignResults
    });
    console.groupEnd();

    totalSpent += campaignSpent;
    totalResults += campaignResults;
  });
  console.groupEnd();

  console.log('\n%c=== FINAL TOTALS ===', 'color: #2196F3; font-weight: bold; font-size: 14px;');
  console.log('💵 Total Spend:', totalSpent.toFixed(2));
  console.log('📈 Total Results:', totalResults);
  console.log('🔄 Processed Insights:', processedInsights);
  console.log('===================\n');

  // Calculate metrics
  const conversionRate = totalSpent > 0 ? (totalResults / totalSpent) * 100 : 0;
  const costPerResult = totalResults > 0 ? totalSpent / totalResults : 0;

  // Calculate previous period metrics (example: 90% of current values)
  const previousTotalSpent = totalSpent * 0.9;
  const previousTotalResults = Math.round(totalResults * 0.9);
  const previousConversionRate = conversionRate * 0.9;
  const previousCostPerResult = costPerResult * 1.1;

  return {
    totalSpent,
    totalResults,
    conversionRate,
    costPerResult,
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

