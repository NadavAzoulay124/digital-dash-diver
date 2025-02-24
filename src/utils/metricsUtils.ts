
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

  // List of action types that might indicate a lead
  const leadActionTypes = ['lead', 'onsite_conversion.lead_grouped', 'leadgen.other'];

  campaigns.forEach((campaign, index) => {
    if (!campaign.insights?.data) {
      console.log(`Campaign ${campaign.name}: No insights available`);
      return;
    }

    campaign.insights.data.forEach(insight => {
      const spent = parseFloat(insight.spend || '0');
      const clicks = parseInt(insight.clicks || '0', 10);
      const impressions = parseInt(insight.impressions || '0', 10);
      
      // Initialize leads for this insight
      let leads = 0;

      // Log all available actions for debugging
      if (insight.actions) {
        console.log(`Actions for campaign "${campaign.name}":`, insight.actions);
        
        // Try to find leads from any of the possible lead action types
        for (const actionType of leadActionTypes) {
          const leadAction = insight.actions.find(action => action.action_type === actionType);
          if (leadAction) {
            const leadCount = parseInt(leadAction.value || '0', 10);
            if (!isNaN(leadCount)) {
              leads += leadCount;
              console.log(`Found ${leadCount} leads with action_type "${actionType}" in campaign "${campaign.name}"`);
            }
          }
        }
      }

      if (!isNaN(spent)) totalSpent += spent;
      if (!isNaN(clicks)) totalClicks += clicks;
      if (!isNaN(impressions)) totalImpressions += impressions;
      if (!isNaN(leads)) totalLeads += leads;

      console.log(`Campaign "${campaign.name}" metrics:`, {
        spent,
        clicks,
        impressions,
        leads,
        dateRange: {
          start: insight.date_start,
          end: insight.date_stop
        },
        rawActions: insight.actions
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
