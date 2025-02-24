
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
  let totalResults = 0;
  let processedInsights = 0;

  console.log('\n=== DETAILED CAMPAIGN ANALYSIS ===\n');
  console.log('Total campaigns received:', campaigns.length);

  campaigns.forEach((campaign, index) => {
    console.log(`\nAnalyzing Campaign ${index + 1}: ${campaign.name}`);
    console.log('Campaign Status:', campaign.status);
    
    if (!campaign.insights?.data) {
      console.log('No insights data array found');
      return;
    }

    console.log('Raw insights data:', JSON.stringify(campaign.insights.data, null, 2));
    
    let campaignSpent = 0;
    let campaignResults = 0;

    // Sort insights by date
    const sortedInsights = [...campaign.insights.data].sort((a, b) => {
      return new Date(a.date_start || '').getTime() - new Date(b.date_stop || '').getTime();
    });

    console.log(`Found ${sortedInsights.length} insights entries`);

    sortedInsights.forEach((insight, insightIndex) => {
      console.log(`\nProcessing insight ${insightIndex + 1}:`, {
        date_start: insight.date_start,
        date_stop: insight.date_stop,
        raw_spend: insight.spend,
        raw_website_purchase: insight.website_purchase
      });

      const spent = Number(insight.spend) || 0;
      const results = Number(insight.website_purchase) || 0;
      
      if (isNaN(spent) || isNaN(results)) {
        console.warn('Invalid numerical values in insight:', {
          spend: insight.spend,
          results: insight.website_purchase
        });
        return;
      }

      console.log('Processed values:', {
        spent: spent,
        results: results
      });

      campaignSpent += spent;
      campaignResults += results;
      processedInsights++;
    });

    console.log('\nCampaign Summary:', {
      name: campaign.name,
      totalSpent: campaignSpent.toFixed(2),
      totalResults: campaignResults,
      insightsProcessed: sortedInsights.length
    });

    totalSpent += campaignSpent;
    totalResults += campaignResults;
  });

  console.log('\n=== FINAL TOTALS ===');
  console.log('Total Campaigns:', campaigns.length);
  console.log('Total Spend:', totalSpent.toFixed(2));
  console.log('Total Results:', totalResults);
  console.log('Total Insights Processed:', processedInsights);
  console.log('\n===================\n');

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

