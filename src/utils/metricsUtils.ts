
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

  console.log(`Processing ${campaigns.length} campaigns for metrics calculation`);

  campaigns.forEach(campaign => {
    if (campaign.insights && campaign.insights.data) {
      // Process all insights data entries for this campaign
      campaign.insights.data.forEach(insights => {
        // Convert spend from string to number, handling potential empty or invalid values
        const spent = insights.spend ? parseFloat(insights.spend) : 0;
        const clicks = insights.clicks ? parseInt(insights.clicks, 10) : 0;
        const impressions = insights.impressions ? parseInt(insights.impressions, 10) : 0;
        
        console.log(`Processing campaign ${campaign.name} insight:`, {
          date_start: insights.date_start,
          date_stop: insights.date_stop,
          spent,
          clicks,
          impressions,
          rawSpend: insights.spend,
          rawClicks: insights.clicks,
          rawImpressions: insights.impressions
        });
        
        if (!isNaN(spent)) {
          totalSpent += spent;
        }
        
        if (!isNaN(clicks)) {
          totalClicks += clicks;
        }
        
        if (!isNaN(impressions)) {
          totalImpressions += impressions;
        }
      });
    }
  });

  console.log('Final totals after processing all insights:', {
    totalSpent,
    totalClicks,
    totalImpressions,
    campaignsProcessed: campaigns.length,
    timestamp: new Date().toISOString()
  });

  // Calculate leads based on clicks (2% conversion rate as previously defined)
  const totalLeads = Math.round(totalClicks * 0.02);

  // Calculate metrics
  const roas = totalSpent > 0 ? (totalLeads * 100) / totalSpent : 0;
  const conversionRate = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0;

  // Calculate previous period metrics (using the same ratios as before)
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

