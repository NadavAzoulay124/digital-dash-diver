
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
    console.log('No campaign data available for metrics calculation');
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
  let totalClicks = 0;
  let totalResults = 0;
  let processedInsights = 0;

  console.log('\n=== CAMPAIGN SPEND AND RESULTS BREAKDOWN ===\n');

  campaigns.forEach((campaign, index) => {
    console.log(`Campaign ${index + 1}: ${campaign.name}`);
    console.log('Status:', campaign.status);
    
    if (!campaign.insights?.data?.length) {
      console.log('No insights data available');
      console.log('------------------------\n');
      return;
    }

    let campaignSpent = 0;
    let campaignClicks = 0;
    let campaignResults = 0;

    // Sort insights by date
    const sortedInsights = [...campaign.insights.data].sort((a, b) => {
      return new Date(a.date_start || '').getTime() - new Date(b.date_stop || '').getTime();
    });

    sortedInsights.forEach((insight) => {
      const spent = Number(insight.spend) || 0;
      const clicks = Number(insight.clicks) || 0;
      
      if (isNaN(spent) || isNaN(clicks)) {
        console.warn('Invalid numerical values in insight:', {
          spend: insight.spend,
          clicks: insight.clicks
        });
        return;
      }

      campaignSpent += spent;
      campaignClicks += clicks;
      // For now, we'll estimate one result per 100 clicks as example data
      // This should be replaced with actual result data from the API
      campaignResults += Math.round(clicks * 0.01);
      processedInsights++;
    });

    console.log('Total Spend:', campaignSpent.toFixed(2));
    console.log('Total Clicks:', campaignClicks);
    console.log('Total Results:', campaignResults);
    console.log('Number of insights:', sortedInsights.length);
    console.log('Date range:', {
      start: sortedInsights[0]?.date_start,
      end: sortedInsights[sortedInsights.length - 1]?.date_stop
    });
    console.log('------------------------\n');

    totalSpent += campaignSpent;
    totalClicks += campaignClicks;
    totalResults += campaignResults;
  });

  console.log('=== FINAL TOTALS ===');
  console.log('Total Campaigns:', campaigns.length);
  console.log('Total Spend:', totalSpent.toFixed(2));
  console.log('Total Results:', totalResults);
  console.log('Total Insights Processed:', processedInsights);
  console.log('\n===================\n');

  // Calculate metrics
  const conversionRate = totalClicks > 0 ? (totalResults / totalClicks) * 100 : 0;
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
