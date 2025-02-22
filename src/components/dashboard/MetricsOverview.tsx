import { Users, DollarSign, Target, ListChecks } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useFacebookAccounts } from "@/hooks/useFacebookAccounts";

export const MetricsOverview = () => {
  const { getSelectedAccount } = useFacebookAccounts();
  const selectedAccount = getSelectedAccount();

  // Query Facebook campaigns data
  const { data: facebookData, isError, isLoading } = useQuery({
    queryKey: ['facebook-campaigns-metrics', selectedAccount?.id],
    queryFn: async () => {
      if (!selectedAccount) {
        console.log('No account selected');
        return { data: [] };
      }

      // Use today's date for initial metrics
      const today = format(new Date(), 'yyyy-MM-dd');
      
      console.log('Fetching campaigns with credentials:', {
        adAccountId: selectedAccount.ad_account_id,
        date: today
      });

      const response = await supabase.functions.invoke('facebook-ads', {
        body: { 
          adAccountId: selectedAccount.ad_account_id,
          accessToken: selectedAccount.access_token,
          since: today,
          until: today
        }
      });

      if (response.error) {
        console.error('Edge function error:', response.error);
        throw new Error(response.error.message || 'Failed to fetch Facebook campaigns');
      }

      console.log('Raw campaign data:', response.data);
      return response.data || { data: [] };
    },
    enabled: !!selectedAccount,
  });

  // Calculate metrics from campaign data
  const calculateMetrics = () => {
    if (!facebookData?.data || !Array.isArray(facebookData.data)) {
      console.log('No campaign data available for metrics calculation');
      return {
        totalSpent: 0,
        totalLeads: 0,
        activeClients: 0,
        openTasks: 0,
        spentChange: 0,
        leadsChange: 0,
        clientsChange: 0,
        tasksChange: 0
      };
    }

    let totalSpent = 0;
    let totalClicks = 0;
    let totalLeads = 0;

    // Calculate current period metrics
    facebookData.data.forEach(campaign => {
      if (campaign.insights && campaign.insights.data && campaign.insights.data[0]) {
        const insights = campaign.insights.data[0];
        
        // Parse numerical values from insights
        const spent = parseFloat(insights.spend || '0');
        const clicks = parseInt(insights.clicks || '0', 10);
        const conversions = parseInt(insights.conversions || '0', 10);
        
        totalSpent += spent;
        totalClicks += clicks;
        totalLeads += conversions || Math.round(clicks * 0.02); // Fallback to estimated leads if no conversion data
      }
    });

    // For demo purposes, simulate percentage changes
    // In a real app, you would compare with historical data
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-card animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load campaign metrics. Please check your Facebook Ads connection.
        </AlertDescription>
      </Alert>
    );
  }

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
