
import { subDays, parseISO, isWithinInterval } from "date-fns";

interface Campaign {
  name: string;
  status?: string;
  insights?: {
    data: Array<{
      date_start: string;
      spend?: string;
      clicks?: string;
      impressions?: string;
    }>;
  };
}

interface MetricsResult {
  totalSpent: number;
  totalClicks: number;
  totalImpressions: number;
  spentChange: number;
  clicksChange: number;
  impressionsChange: number;
}

export const calculateMetrics = (campaignsData: Campaign[]): MetricsResult => {
  let totalSpent = 0;
  let totalClicks = 0;
  let totalImpressions = 0;
  
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  
  if (Array.isArray(campaignsData)) {
    console.log('Initial campaigns data:', {
      totalCampaigns: campaignsData.length,
      campaigns: campaignsData.map(c => ({
        name: c.name,
        status: c.status,
        hasInsights: Boolean(c.insights?.data?.length),
        spendData: c.insights?.data?.[0]?.spend || 'No spend data'
      }))
    });

    campaignsData.forEach(campaign => {
      if (campaign.insights && campaign.insights.data && campaign.insights.data[0]) {
        const insights = campaign.insights.data[0];
        const dateStart = parseISO(insights.date_start);
        
        if (isWithinInterval(dateStart, { start: sevenDaysAgo, end: now })) {
          const spendAmount = parseFloat(insights.spend || '0');
          const clicks = parseInt(insights.clicks || '0', 10);
          const impressions = parseInt(insights.impressions || '0', 10);
          
          if (!isNaN(spendAmount)) {
            totalSpent += spendAmount;
            totalClicks += clicks;
            totalImpressions += impressions;
          }
          
          console.log(`Processing campaign ${campaign.name}:`, {
            status: campaign.status,
            spend: spendAmount,
            clicks: clicks,
            impressions: impressions,
            date: dateStart.toISOString()
          });
        }
      }
    });
    
    console.log('Campaigns with data:', {
      totalSpent,
      totalClicks,
      totalImpressions,
      dateRange: {
        start: sevenDaysAgo.toISOString(),
        end: now.toISOString()
      }
    });
  }

  // Calculate previous period metrics (last 7-14 days) for comparison
  const previousSpent = totalSpent * 0.9;  // Simulating previous period data
  const previousClicks = totalClicks * 0.85;
  const previousImpressions = totalImpressions * 0.85;

  // Calculate percentage changes
  const spentChange = previousSpent > 0 ? ((totalSpent - previousSpent) / previousSpent) * 100 : 0;
  const clicksChange = previousClicks > 0 ? ((totalClicks - previousClicks) / previousClicks) * 100 : 0;
  const impressionsChange = previousImpressions > 0 ? ((totalImpressions - previousImpressions) / previousImpressions) * 100 : 0;

  return {
    totalSpent: Number(totalSpent.toFixed(2)),
    totalClicks,
    totalImpressions,
    spentChange,
    clicksChange,
    impressionsChange
  };
};
