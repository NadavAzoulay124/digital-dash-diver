
import { Users, DollarSign, Target, ListChecks } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
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

      // Use today's date for initial metrics
      const today = format(new Date(), 'yyyy-MM-dd');
      
      console.log('Fetching Facebook campaigns with credentials:', {
        adAccountId: selectedFacebookAccount.ad_account_id,
        date: today
      });

      const response = await supabase.functions.invoke('facebook-ads', {
        body: { 
          adAccountId: selectedFacebookAccount.ad_account_id,
          accessToken: selectedFacebookAccount.access_token,
          since: today,
          until: today
        }
      });

      if (response.error) {
        console.error('Facebook edge function error:', response.error);
        throw new Error(response.error.message || 'Failed to fetch Facebook campaigns');
      }

      return response.data || { data: [] };
    },
    enabled: !!selectedFacebookAccount,
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

    // Calculate Facebook metrics
    if (facebookData?.data && Array.isArray(facebookData.data)) {
      facebookData.data.forEach(campaign => {
        if (campaign.insights && campaign.insights.data && campaign.insights.data[0]) {
          const insights = campaign.insights.data[0];
          totalSpent += parseFloat(insights.spend || '0');
          totalClicks += parseInt(insights.clicks || '0', 10);
          totalLeads += parseInt(insights.conversions || '0', 10) || Math.round(totalClicks * 0.02);
        }
      });
    }

    // For demo purposes, simulate percentage changes
    const spentChange = 15.2;
    const leadsChange = 12;
    const clientsChange = 4;
    const tasksChange = 2;

    return {
      totalSpent,
      totalLeads,
      activeClients: 48, // This would come from a different data source
      openTasks: 24, // This would come from a different data source
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
        change={`${metrics.spentChange}%`}
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
