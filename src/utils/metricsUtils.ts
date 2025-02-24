
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
  console.log('%c=== CAMPAIGN ANALYSIS START ===', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Total campaigns to analyze:', campaigns.length);

  campaigns.forEach((campaign, index) => {
    console.group(`Campaign ${index + 1}: ${campaign.name}`);
    console.log('Status:', campaign.status);
    
    if (!campaign.insights?.data) {
      console.warn('⚠️ No insights data available');
      console.groupEnd();
      return;
    }

    const insights = campaign.insights.data;
    console.log(`📊 Found ${insights.length} insights entries`);

    let campaignSpent = 0;
    let campaignResults = 0;

    insights.forEach(insight => {
      const spent = Number(insight.spend) || 0;
      const results = Number(insight.website_purchase) || 0;

      if (!isNaN(spent) && !isNaN(results)) {
        campaignSpent += spent;
        campaignResults += results;
        processedInsights++;
      }
    });

    console.log('💰 Campaign Total Spent:', campaignSpent.toFixed(2));
    console.log('🎯 Campaign Total Results:', campaignResults);
    console.groupEnd();

    totalSpent += campaignSpent;
    totalResults += campaignResults;
  });

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

