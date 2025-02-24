
import { Campaign } from "@/components/dashboard/types";

interface Metrics {
  totalSpent: number;
  totalClicks: number;
  totalImpressions: number;
  previousTotalSpent: number;
  previousTotalClicks: number;
  previousTotalImpressions: number;
}

export const calculateMetrics = (campaigns: Campaign[]): Metrics => {
  if (!campaigns || !Array.isArray(campaigns)) {
    console.warn('🚨 No campaign data available for metrics calculation');
    return {
      totalSpent: 0,
      totalClicks: 0,
      totalImpressions: 0,
      previousTotalSpent: 0,
      previousTotalClicks: 0,
      previousTotalImpressions: 0
    };
  }

  let totalSpent = 0;
  let totalClicks = 0;
  let totalImpressions = 0;

  console.clear();
  console.log('%c=== PROCESSING FACEBOOK CAMPAIGN DATA ===', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
  console.log('Total campaigns:', campaigns.length);

  campaigns.forEach((campaign) => {
    console.log(`\nProcessing campaign: ${campaign.name}`);
    console.log('Campaign objective:', campaign.objective);

    if (!campaign.insights?.data || campaign.insights.data.length === 0) {
      console.log(`Campaign ${campaign.name}: No insights data available`);
      return;
    }

    campaign.insights.data.forEach((insight, index) => {
      console.log(`\nProcessing insight ${index + 1} for campaign ${campaign.name}:`);
      
      const spent = parseFloat(insight.spend || '0');
      const clicks = parseInt(insight.clicks || '0', 10);
      const impressions = parseInt(insight.impressions || '0', 10);

      if (!isNaN(spent)) totalSpent += spent;
      if (!isNaN(clicks)) totalClicks += clicks;
      if (!isNaN(impressions)) totalImpressions += impressions;

      console.log('Insight metrics:', {
        spent,
        clicks,
        impressions,
        dateRange: {
          start: insight.date_start,
          end: insight.date_stop
        }
      });
    });
  });

  console.log('\n%c=== FINAL METRICS ===', 'color: #2196F3; font-weight: bold; font-size: 14px;');
  console.log('💵 Total Spend:', totalSpent.toFixed(2));
  console.log('🖱️ Total Clicks:', totalClicks);
  console.log('👀 Total Impressions:', totalImpressions);
  console.log('===================\n');

  // Calculate previous period metrics (using 90% of current as example)
  const previousTotalSpent = totalSpent * 0.9;
  const previousTotalClicks = Math.round(totalClicks * 0.9);
  const previousTotalImpressions = Math.round(totalImpressions * 0.9);

  return {
    totalSpent,
    totalClicks,
    totalImpressions,
    previousTotalSpent,
    previousTotalClicks,
    previousTotalImpressions
  };
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
