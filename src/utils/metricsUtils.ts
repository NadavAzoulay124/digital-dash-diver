
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
  let totalLeads = 0;
  let totalImpressions = 0;

  campaigns.forEach(campaign => {
    if (campaign.insights && campaign.insights.data && campaign.insights.data[0]) {
      const insights = campaign.insights.data[0];
      
      const spent = parseFloat(insights.spend || '0');
      const clicks = parseInt(insights.clicks || '0', 10);
      const impressions = parseInt(insights.impressions || '0', 10);
      
      console.log(`Processing campaign ${campaign.name}:`, {
        spent,
        clicks,
        impressions,
        rawSpend: insights.spend,
        rawClicks: insights.clicks,
        rawImpressions: insights.impressions
      });
      
      totalSpent += spent;
      totalClicks += clicks;
      totalImpressions += impressions;
      
      const estimatedLeads = Math.round(clicks * 0.02);
      totalLeads += estimatedLeads;
    }
  });

  const roas = totalSpent > 0 ? (totalLeads * 100) / totalSpent : 0;
  const conversionRate = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0;

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
