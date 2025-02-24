
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

  console.log(`Starting metrics calculation for ${campaigns.length} campaigns`);

  campaigns.forEach((campaign, index) => {
    if (!campaign.insights?.data?.length) {
      console.log(`Campaign ${campaign.name} has no insights data`);
      return;
    }

    console.log(`Processing campaign ${index + 1}/${campaigns.length}: ${campaign.name}`);
    let campaignSpent = 0;
    let campaignClicks = 0;
    let campaignImpressions = 0;

    // Sort insights by date
    const sortedInsights = [...campaign.insights.data].sort((a, b) => {
      return new Date(a.date_start || '').getTime() - new Date(b.date_stop || '').getTime();
    });

    sortedInsights.forEach((insight, insightIndex) => {
      const spent = Number(insight.spend) || 0;
      const clicks = Number(insight.clicks) || 0;
      const impressions = Number(insight.impressions) || 0;

      if (isNaN(spent) || isNaN(clicks) || isNaN(impressions)) {
        console.warn(`Invalid numerical values in insight for campaign ${campaign.name}:`, {
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

      console.log(`Insight ${insightIndex + 1}/${sortedInsights.length} for ${campaign.name}:`, {
        date: insight.date_start,
        spent,
        clicks,
        impressions
      });
    });

    console.log(`Campaign ${campaign.name} totals:`, {
      spent: campaignSpent,
      clicks: campaignClicks,
      impressions: campaignImpressions
    });

    totalSpent += campaignSpent;
    totalClicks += campaignClicks;
    totalImpressions += campaignImpressions;
  });

  console.log('Final calculation results:', {
    totalSpent,
    totalClicks,
    totalImpressions,
    processedCampaigns: campaigns.length,
    processedInsights,
    timestamp: new Date().toISOString()
  });

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

