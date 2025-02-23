
import { subDays, parseISO, isWithinInterval } from "date-fns";

interface Campaign {
  name: string;
  status?: string;
  insights?: {
    data: Array<{
      date_start: string;
      spend?: string;
      clicks?: string;
    }>;
  };
}

interface MetricsResult {
  totalSpent: number;
  totalLeads: number;
  activeClients: number;
  openTasks: number;
  spentChange: number;
  leadsChange: number;
  clientsChange: number;
  tasksChange: number;
}

export const calculateMetrics = (campaignsData: Campaign[]): MetricsResult => {
  let totalSpent = 0;
  let totalLeads = 0;
  let totalClicks = 0;
  let campaignCount = 0;
  
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  
  if (Array.isArray(campaignsData)) {
    // Filter for active campaigns only
    const activeCampaigns = campaignsData.filter(campaign => campaign.status === 'ACTIVE');
    
    activeCampaigns.forEach(campaign => {
      if (campaign.insights && campaign.insights.data && campaign.insights.data[0]) {
        const insights = campaign.insights.data[0];
        const dateStart = parseISO(insights.date_start);
        
        if (isWithinInterval(dateStart, { start: sevenDaysAgo, end: now })) {
          campaignCount++;
          
          const spendAmount = parseFloat(insights.spend || '0');
          console.log(`Active campaign ${campaign.name}:`, {
            status: campaign.status,
            spend: spendAmount,
            rawSpend: insights.spend,
            clicks: insights.clicks,
            date: dateStart.toISOString()
          });
          
          if (!isNaN(spendAmount)) {
            totalSpent += spendAmount;
          }
          
          const clicks = parseInt(insights.clicks || '0', 10);
          totalClicks += clicks;
          
          const estimatedLeads = Math.round(clicks * 0.02);
          totalLeads += estimatedLeads;
        }
      }
    });
  }

  console.log('Final metrics calculation for active campaigns in last 7 days:', {
    timestamp: new Date().toISOString(),
    totalSpent,
    totalClicks,
    totalLeads,
    campaignCount,
    dateRange: {
      start: sevenDaysAgo.toISOString(),
      end: now.toISOString()
    }
  });

  const spentChange = ((totalSpent - totalSpent * 0.9) / (totalSpent * 0.9)) * 100;
  const leadsChange = 12;
  const clientsChange = 4;
  const tasksChange = 2;

  return {
    totalSpent,
    totalLeads,
    activeClients: 48,
    openTasks: 24,
    spentChange,
    leadsChange,
    clientsChange,
    tasksChange
  };
};
