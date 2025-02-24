
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
  let campaignCount = 0;
  
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

    const campaignsWithData: Array<{
      name: string;
      spend: number;
      clicks: number;
      impressions: number;
      date: string;
      status: string;
    }> = [];
    
    campaignsData.forEach(campaign => {
      if (campaign.insights && campaign.insights.data && campaign.insights.data[0]) {
        const insights = campaign.insights.data[0];
        const dateStart = parseISO(insights.date_start);
        
        const isWithinRange = isWithinInterval(dateStart, { start: sevenDaysAgo, end: now });
        
        if (isWithinRange) {
          campaignCount++;
          
          const spendAmount = parseFloat(insights.spend || '0');
          const clicks = parseInt(insights.clicks || '0', 10);
          const impressions = parseInt(insights.impressions || '0', 10);
          
          if (!isNaN(spendAmount)) {
            campaignsWithData.push({
              name: campaign.name,
              spend: spendAmount,
              clicks: clicks,
              impressions: impressions,
              date: dateStart.toISOString(),
              status: campaign.status || 'UNKNOWN'
            });
            
            totalSpent += spendAmount;
            totalClicks += clicks;
            totalImpressions += impressions;
          }
          
          console.log(`Processing campaign ${campaign.name}:`, {
            status: campaign.status,
            spend: spendAmount,
            clicks: clicks,
            impressions: impressions,
            date: dateStart.toISOString(),
            isWithinRange
          });
        }
      }
    });
    
    console.log('Campaigns with data in last 7 days:', {
      dateRange: {
        start: sevenDaysAgo.toISOString(),
        end: now.toISOString()
      },
      campaigns: campaignsWithData,
      totalSpent,
      totalClicks,
      totalImpressions,
      totalCampaignsWithData: campaignsWithData.length
    });
  }

  const previousSpent = totalSpent * 0.9; // For demo - assume 10% less in previous period
  const previousClicks = totalClicks * 0.85; // For demo - assume 15% less in previous period
  const previousImpressions = totalImpressions * 0.85; // For demo - assume 15% less in previous period

  const spentChange = ((totalSpent - previousSpent) / previousSpent) * 100;
  const clicksChange = ((totalClicks - previousClicks) / previousClicks) * 100;
  const impressionsChange = ((totalImpressions - previousImpressions) / previousImpressions) * 100;

  return {
    totalSpent,
    totalClicks,
    totalImpressions,
    spentChange,
    clicksChange,
    impressionsChange
  };
};

