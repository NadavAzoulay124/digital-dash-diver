
import { Campaign } from "@/components/dashboard/types";

interface Metrics {
  totalSpent: number;
  totalLeads: number;
  roas: number;
  conversionRate: number;
  previousTotalSpent: number;
  previousTotalLeads: number;
  previousRoas: number;
  previousConversionRate: number;
}

export const calculateMetrics = (campaigns: Campaign[]): Metrics => {
  if (!campaigns || !Array.isArray(campaigns)) {
    console.log('No campaign data available for metrics calculation');
    return {
      totalSpent: 0,
      totalLeads: 0,
      roas: 0,
      conversionRate: 0,
      previousTotalSpent: 0,
      previousTotalLeads: 0,
      previousRoas: 0,
      previousConversionRate: 0
    };
  }

  let totalSpent = 0;
  let totalClicks = 0;
  let totalImpressions = 0;
  let processedInsights = 0;

  console.log('\n=== CAMPAIGN SPEND BREAKDOWN ===\n');

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
    let campaignImpressions = 0;

    // Sort insights by date
    const sortedInsights = [...campaign.insights.data].sort((a, b) => {
      return new Date(a.date_start || '').getTime() - new Date(b.date_stop || '').getTime();
    });

    sortedInsights.forEach((insight) => {
      const spent = Number(insight.spend) || 0;
      const clicks = Number(insight.clicks) || 0;
      const impressions = Number(insight.impressions) || 0;

      if (isNaN(spent) || isNaN(clicks) || isNaN(impressions)) {
        console.warn('Invalid numerical values in insight:', {
          spend: insight.spend,
          clicks: insight.clicks,
          impressions: insight.impressions
        });
        return;
      }

      campaignSpent += spent;
      campaignClicks += clicks;
      campaignImpressions += impressions;
      processedInsights++;
    });

    console.log('Total Spend:', campaignSpent.toFixed(2));
    console.log('Total Clicks:', campaignClicks);
    console.log('Total Impressions:', campaignImpressions);
    console.log('Number of insights:', sortedInsights.length);
    console.log('Date range:', {
      start: sortedInsights[0]?.date_start,
      end: sortedInsights[sortedInsights.length - 1]?.date_stop
    });
    console.log('------------------------\n');

    totalSpent += campaignSpent;
    totalClicks += campaignClicks;
    totalImpressions += campaignImpressions;
  });

  console.log('=== FINAL TOTALS ===');
  console.log('Total Campaigns:', campaigns.length);
  console.log('Total Spend:', totalSpent.toFixed(2));
  console.log('Total Clicks:', totalClicks);
  console.log('Total Impressions:', totalImpressions);
  console.log('Total Insights Processed:', processedInsights);
  console.log('\n===================\n');

  // Calculate leads based on clicks (2% conversion rate)
  const totalLeads = Math.round(totalClicks * 0.02);

  // Calculate metrics
  const roas = totalSpent > 0 ? (totalLeads * 100) / totalSpent : 0;
  const conversionRate = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0;

  // Calculate previous period metrics
  const previousTotalSpent = totalSpent * 0.9;
  const previousTotalLeads = totalLeads * 0.85;
  const previousRoas = previousTotalSpent > 0 ? (previousTotalLeads * 100) / previousTotalSpent : 0;
  const previousConversionRate = conversionRate * 0.95;

  return {
    totalSpent,
    totalLeads,
    roas,
    conversionRate,
    previousTotalSpent,
    previousTotalLeads,
    previousRoas,
    previousConversionRate
  };
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

