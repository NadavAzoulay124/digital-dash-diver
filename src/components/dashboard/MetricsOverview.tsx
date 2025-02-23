
import { Users, DollarSign, Target, ListChecks } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subHours } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useFacebookAccounts } from "@/hooks/useFacebookAccounts";

export const MetricsOverview = () => {
  const { getSelectedAccount: getSelectedFacebookAccount } = useFacebookAccounts();
  const selectedFacebookAccount = getSelectedFacebookAccount();

  // Query Facebook campaigns data
  const { data: facebookData, isError: isFacebookError, isLoading: isFacebookLoading } = useQuery({
    queryKey: ['facebook-campaigns-metrics', selectedFacebookAccount?.id],
    queryFn: async () => {
      if (!selectedFacebookAccount) {
        console.log('No Facebook account selected');
        return { data: [] };
      }

      // Use date with timezone offset to ensure we get full day's data
      const today = new Date();
      const yesterdayDate = subHours(today, 24);
      const todayStr = format(today, 'yyyy-MM-dd');
      
      console.log('Fetching Facebook campaigns with credentials:', {
        adAccountId: selectedFacebookAccount.ad_account_id,
        clientName: selectedFacebookAccount.client_name,
        date: todayStr,
        currentTime: today.toISOString(),
      });

      const response = await supabase.functions.invoke('facebook-ads', {
        body: { 
          adAccountId: selectedFacebookAccount.ad_account_id,
          accessToken: selectedFacebookAccount.access_token,
          since: todayStr,
          until: todayStr,
          clientName: selectedFacebookAccount.client_name,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone // Send local timezone
        }
      });

      if (response.error) {
        console.error('Facebook edge function error:', response.error);
        throw new Error(response.error.message || 'Failed to fetch Facebook campaigns');
      }

      console.log('Response from Facebook API:', {
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        data: response.data
      });
      
      return response.data || { data: [] };
    },
    enabled: !!selectedFacebookAccount,
    refetchInterval: 300000, // Refresh every 5 minutes to get latest data
  });

  if (isFacebookLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-card animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (isFacebookError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load campaign metrics. Please check your Facebook connection.
        </AlertDescription>
      </Alert>
    );
  }

  // Calculate metrics from Facebook data
  const calculateMetrics = () => {
    let totalSpent = 0;
    let totalLeads = 0;
    let totalClicks = 0;
    let campaignCount = 0;

    // Calculate Facebook metrics
    if (facebookData?.data && Array.isArray(facebookData.data)) {
      facebookData.data.forEach(campaign => {
        if (campaign.insights && campaign.insights.data && campaign.insights.data[0]) {
          campaignCount++;
          const insights = campaign.insights.data[0];
          // Make sure to parse the spend value as a float
          const spendAmount = parseFloat(insights.spend || '0');
          console.log(`Campaign ${campaign.name}:`, {
            spend: spendAmount,
            rawSpend: insights.spend,
            clicks: insights.clicks,
            status: campaign.status,
            date: insights.date_start
          });
          
          if (!isNaN(spendAmount)) {
            totalSpent += spendAmount;
          }
          
          const clicks = parseInt(insights.clicks || '0', 10);
          totalClicks += clicks;
          
          // Estimate leads based on clicks with a 2% conversion rate
          const estimatedLeads = Math.round(clicks * 0.02);
          totalLeads += estimatedLeads;
        }
      });
    }

    console.log('Metrics calculation summary:', {
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      totalSpent,
      totalClicks,
      totalLeads,
      campaignCount
    });

    // For demo purposes, simulate percentage changes
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

  const metrics = calculateMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Spent"
        value={`$${metrics.totalSpent.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`}
        change={`${metrics.spentChange.toFixed(1)}%`}
        isPositive={false}
        icon={DollarSign}
      />
      <MetricCard
        title="Active Clients"
        value={metrics.activeClients.toString()}
        change={`+${metrics.clientsChange}`}
        isPositive={true}
        icon={Users}
      />
      <MetricCard
        title="New Leads"
        value={metrics.totalLeads.toString()}
        change={`+${metrics.leadsChange}`}
        isPositive={true}
        icon={Target}
      />
      <MetricCard
        title="Open Tasks"
        value={metrics.openTasks.toString()}
        change={`+${metrics.tasksChange}`}
        isPositive={false}
        icon={ListChecks}
      />
    </div>
  );
};
