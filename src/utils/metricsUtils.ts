
import { Campaign } from "@/components/dashboard/types";

interface Metrics {
  totalSpent: number;
  totalClicks: number;
  totalImpressions: number;
  costPerClick: number;
  averageFrequency: number;
  previousTotalSpent: number;
  previousTotalClicks: number;
  previousCostPerClick: number;
  previousAverageFrequency: number;
}

export const calculateMetrics = (campaigns: Campaign[]): Metrics => {
  if (!campaigns || !Array.isArray(campaigns)) {
    console.warn('🚨 No campaign data available for metrics calculation');
    return {
      totalSpent: 0,
      totalClicks: 0,
      totalImpressions: 0,
      costPerClick: 0,
      averageFrequency: 0,
      previousTotalSpent: 0,
      previousTotalClicks: 0,
      previousCostPerClick: 0,
      previousAverageFrequency: 0
    };
  }

  let totalSpent = 0;
  let totalClicks = 0;
  let totalImpressions = 0;
  let totalFrequency = 0;
  let campaignsWithFrequency = 0;

  console.clear();
  console.log('%c=== PROCESSING FACEBOOK CAMPAIGN DATA ===', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
  console.log('Total campaigns:', campaigns.length);

  campaigns.forEach((campaign, index) => {
    if (!campaign.insights?.data) {
      console.log(`Campaign ${campaign.name}: No insights available`);
      return;
    }

    campaign.insights.data.forEach(insight => {
      const spent = parseFloat(insight.spend || '0');
      const clicks = parseInt(insight.clicks || '0', 10);
      const impressions = parseInt(insight.impressions || '0', 10);
      const frequency = parseFloat(insight.frequency || '0');

      if (!isNaN(spent)) totalSpent += spent;
      if (!isNaN(clicks)) totalClicks += clicks;
      if (!isNaN(impressions)) totalImpressions += impressions;
      if (!isNaN(frequency) && frequency > 0) {
        totalFrequency += frequency;
        campaignsWithFrequency++;
      }

      console.log(`Campaign "${campaign.name}" metrics:`, {
        spent,
        clicks,
        impressions,
        frequency,
        dateRange: {
          start: insight.date_start,
          end: insight.date_stop
        }
      });
    });
  });

  const costPerClick = totalClicks > 0 ? totalSpent / totalClicks : 0;
  const averageFrequency = campaignsWithFrequency > 0 ? totalFrequency / campaignsWithFrequency : 0;

  console.log('\n%c=== FINAL METRICS ===', 'color: #2196F3; font-weight: bold; font-size: 14px;');
  console.log('💵 Total Spend:', totalSpent.toFixed(2));
  console.log('🖱️ Total Clicks:', totalClicks);
  console.log('👀 Total Impressions:', totalImpressions);
  console.log('💰 Cost per Click:', costPerClick.toFixed(2));
  console.log('🔄 Average Frequency:', averageFrequency.toFixed(2));
  console.log('===================\n');

  // Calculate previous period metrics (using 90% of current as example)
  const previousTotalSpent = totalSpent * 0.9;
  const previousTotalClicks = Math.round(totalClicks * 0.9);
  const previousCostPerClick = costPerClick * 1.1;
  const previousAverageFrequency = averageFrequency * 0.9;

  return {
    totalSpent,
    totalClicks,
    totalImpressions,
    costPerClick,
    averageFrequency,
    previousTotalSpent,
    previousTotalClicks,
    previousCostPerClick,
    previousAverageFrequency
  };
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
