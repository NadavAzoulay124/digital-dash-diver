
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
    console.log('Initial campaigns data:', {
      totalCampaigns: campaignsData.length,
      campaigns: campaignsData.map(c => ({
        name: c.name,
        status: c.status,
        hasInsights: Boolean(c.insights?.data?.length),
        spendData: c.insights?.data?.[0]?.spend || 'No spend data'
      }))
    });

    // Filter for active campaigns only
    const activeCampaigns = campaignsData.filter(campaign => campaign.status === 'ACTIVE');
    
    console.log('Active campaigns:', {
      totalActive: activeCampaigns.length,
      activeCampaigns: activeCampaigns.map(c => ({
        name: c.name,
        spendData: c.insights?.data?.[0]?.spend || 'No spend data',
        date: c.insights?.data?.[0]?.date_start || 'No date'
      }))
    });
    
    const campaignsWithSpend: Array<{name: string, spend: number, date: string}> = [];
    
    activeCampaigns.forEach(campaign => {
      if (campaign.insights && campaign.insights.data && campaign.insights.data[0]) {
        const insights = campaign.insights.data[0];
        const dateStart = parseISO(insights.date_start);
        
        const isWithinRange = isWithinInterval(dateStart, { start: sevenDaysAgo, end: now });
        
        if (isWithinRange) {
          campaignCount++;
          
          const spendAmount = parseFloat(insights.spend || '0');
          if (!isNaN(spendAmount) && spendAmount > 0) {
            campaignsWithSpend.push({
              name: campaign.name,
              spend: spendAmount,
              date: dateStart.toISOString()
            });
          }
          
          console.log(`Processing campaign ${campaign.name}:`, {
            status: campaign.status,
            spend: spendAmount,
            rawSpend: insights.spend,
            clicks: insights.clicks,
            date: dateStart.toISOString(),
            isWithinRange
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
    
    console.log('Campaigns with spend in last 7 days:', {
      dateRange: {
        start: sevenDaysAgo.toISOString(),
        end: now.toISOString()
      },
      campaigns: campaignsWithSpend
    });
  }

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

