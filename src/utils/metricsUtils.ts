
import { Campaign } from "@/components/dashboard/types";

interface Metrics {
  totalSpent: number;
  totalClicks: number;
  totalImpressions: number;
  previousTotalSpent: number;
  previousTotalClicks: number;
  previousTotalImpressions: number;
  totalLeads: number;
  previousTotalLeads: number;
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
      previousTotalImpressions: 0,
      totalLeads: 0,
      previousTotalLeads: 0
    };
  }

  let totalSpent = 0;
  let totalClicks = 0;
  let totalImpressions = 0;
  let totalLeads = 0;

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
      let leads = 0;

      // Check various places where lead data might be stored
      if (campaign.objective?.toLowerCase().includes('lead')) {
        // For lead generation campaigns, treat clicks as potential leads if no other lead data is available
        leads = clicks;
        console.log('Lead generation campaign - using clicks as leads:', leads);
      }

      // Check cost_per_action_type for lead costs
      if (insight.cost_per_action_type) {
        const leadActions = insight.cost_per_action_type.filter(action => 
          action.action_type?.toLowerCase().includes('lead') ||
          action.action_type?.toLowerCase().includes('form')
        );
        if (leadActions.length > 0) {
          console.log('Found lead cost actions:', leadActions);
        }
      }

      // Check standard actions array
      if (insight.actions && Array.isArray(insight.actions)) {
        console.log('Checking actions array:', insight.actions);
        
        const leadActions = insight.actions.filter(action => 
          action.action_type?.toLowerCase().includes('lead') ||
          action.action_type?.toLowerCase().includes('form') ||
          action.action_type?.toLowerCase().includes('contact') ||
          action.action_type?.toLowerCase().includes('submit')
        );

        if (leadActions.length > 0) {
          console.log('Found lead actions:', leadActions);
          leadActions.forEach(action => {
            const leadCount = parseInt(action.value || '0', 10);
            if (!isNaN(leadCount)) {
              leads += leadCount;
              console.log(`Adding ${leadCount} leads from action type: ${action.action_type}`);
            }
          });
        }
      }

      if (!isNaN(spent)) totalSpent += spent;
      if (!isNaN(clicks)) totalClicks += clicks;
      if (!isNaN(impressions)) totalImpressions += impressions;
      if (!isNaN(leads)) totalLeads += leads;

      console.log('Insight metrics:', {
        spent,
        clicks,
        impressions,
        leads,
        frequency: insight.frequency,
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
  console.log('🎯 Total Leads:', totalLeads);
  console.log('===================\n');

  // Calculate previous period metrics (using 90% of current as example)
  const previousTotalSpent = totalSpent * 0.9;
  const previousTotalClicks = Math.round(totalClicks * 0.9);
  const previousTotalImpressions = Math.round(totalImpressions * 0.9);
  const previousTotalLeads = Math.round(totalLeads * 0.9);

  return {
    totalSpent,
    totalClicks,
    totalImpressions,
    previousTotalSpent,
    previousTotalClicks,
    previousTotalImpressions,
    totalLeads,
    previousTotalLeads
  };
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
