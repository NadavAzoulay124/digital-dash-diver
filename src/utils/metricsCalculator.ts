
import { subDays, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";

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
  const yesterday = endOfDay(subDays(now, 1)); // End date is end of yesterday
  const sevenDaysAgo = startOfDay(subDays(yesterday, 6)); // Start date is start of 7 days before yesterday
  
  if (Array.isArray(campaignsData)) {
    console.log('Initial campaigns data:', {
      totalCampaigns: campaignsData.length,
      dateRange: {
        start: sevenDaysAgo.toISOString(),
        end: yesterday.toISOString()
      },
      campaigns: campaignsData.map(c => ({
        name: c.name,
        status: c.status,
        hasInsights: Boolean(c.insights?.data?.length),
        spendData: c.insights?.data?.[0]?.spend || 'No spend data'
      }))
    });

    const campaignsWithSpend: Array<{name: string, spend: number, date: string, status: string}> = [];
    
    campaignsData.forEach(campaign => {
      if (campaign.insights && campaign.insights.data && campaign.insights.data[0]) {
        const insights = campaign.insights.data[0];
        const dateStart = startOfDay(parseISO(insights.date_start)); // Ensure we're comparing full days
        
        const isWithinRange = isWithinInterval(dateStart, { 
          start: sevenDaysAgo, 
          end: yesterday
        });
        
        if (isWithinRange) {
          campaignCount++;
          
          const spendAmount = parseFloat(insights.spend || '0');
          if (!isNaN(spendAmount)) {
            campaignsWithSpend.push({
              name: campaign.name,
              spend: spendAmount,
              date: dateStart.toISOString(),
              status: campaign.status || 'UNKNOWN'
            });
            
            totalSpent += spendAmount;
          }
          
          console.log(`Processing campaign ${campaign.name}:`, {
            status: campaign.status,
            spend: spendAmount,
            rawSpend: insights.spend,
            clicks: insights.clicks,
            date: dateStart.toISOString(),
            isWithinRange
          });
          
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
        end: yesterday.toISOString()
      },
      campaigns: campaignsWithSpend,
      totalSpent,
      totalCampaignsWithSpend: campaignsWithSpend.length
    });
  }

  const previousSpent = totalSpent * 0.9; // For demo - assume 10% less in previous period
  const spentChange = ((totalSpent - previousSpent) / previousSpent) * 100;
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
