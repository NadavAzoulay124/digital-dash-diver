
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CampaignChart } from "@/components/dashboard/CampaignChart";
import { ClientTaskRequest } from "@/components/dashboard/ClientTaskRequest";
import { ClientLeadStats } from "@/components/dashboard/ClientLeadStats";
import { LeadsBoard } from "@/components/dashboard/LeadsBoard";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { CampaignInsights } from "@/components/dashboard/CampaignInsights";
import { DollarSign, TrendingUp, Users, Target } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { format } from "date-fns";

const ClientDashboard = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ startDate?: Date; endDate?: Date }>({});
  
  const handleDateChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    setDateRange({ startDate, endDate });
  };

  const { data: facebookData, isLoading } = useQuery({
    queryKey: ['facebook-campaigns', dateRange],
    queryFn: async () => {
      const { data: credentials, error: credentialsError } = await supabase
        .from('facebook_ads_credentials')
        .select('*')
        .maybeSingle();

      if (credentialsError) {
        console.error('Error fetching credentials:', credentialsError);
        throw new Error('Failed to fetch Facebook credentials');
      }

      if (!credentials) {
        console.log('No Facebook credentials found');
        return { data: [] };
      }

      const dateParams: any = {};
      if (dateRange.startDate) {
        dateParams.since = format(dateRange.startDate, 'yyyy-MM-dd');
      }
      if (dateRange.endDate) {
        dateParams.until = format(dateRange.endDate, 'yyyy-MM-dd');
      }

      console.log('Fetching campaigns with params:', { credentials, dateParams });
      const response = await supabase.functions.invoke('facebook-ads', {
        body: { 
          adAccountId: credentials.ad_account_id,
          accessToken: credentials.access_token,
          ...dateParams
        }
      });

      if (response.error) {
        console.error('Edge function error:', response.error);
        throw new Error(response.error.message || 'Failed to fetch Facebook campaigns');
      }

      console.log('Raw campaign data:', response.data);
      return response.data || { data: [] };
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast({
          title: "Error fetching campaigns",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  // Calculate aggregate metrics from campaign data
  const calculateMetrics = () => {
    if (!facebookData?.data || !Array.isArray(facebookData.data)) {
      console.log('No campaign data available for metrics calculation');
      return {
        totalSpent: 0,
        totalLeads: 0,
        roas: 0,
        conversionRate: 0,
        previousTotalSpent: 0,
        previousTotalLeads: 0,
        previousRoas: 0,
        previousConversionRate: 0
      };
    }

    let totalSpent = 0;
    let totalClicks = 0;
    let totalLeads = 0;
    let totalImpressions = 0;

    // Calculate current period metrics
    facebookData.data.forEach(campaign => {
      if (campaign.insights && campaign.insights.data && campaign.insights.data[0]) {
        const insights = campaign.insights.data[0];
        
        // Parse numerical values from insights
        const spent = parseFloat(insights.spend || '0');
        const clicks = parseInt(insights.clicks || '0', 10);
        const impressions = parseInt(insights.impressions || '0', 10);
        
        console.log(`Processing campaign ${campaign.name}:`, {
          spent,
          clicks,
          impressions,
          rawSpend: insights.spend,
          rawClicks: insights.clicks,
          rawImpressions: insights.impressions
        });
        
        totalSpent += spent;
        totalClicks += clicks;
        totalImpressions += impressions;
        
        // For now, we'll estimate leads based on clicks with a 2% conversion rate
        // This is temporary until we get actual conversion data from Facebook
        const estimatedLeads = Math.round(clicks * 0.02);
        totalLeads += estimatedLeads;
      }
    });

    // Calculate metrics for current period
    const roas = totalSpent > 0 ? (totalLeads * 100) / totalSpent : 0; // Assuming $100 per lead
    const conversionRate = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0;

    // For demo purposes, simulate previous period metrics
    // In a real application, you would fetch historical data
    const previousTotalSpent = totalSpent * 0.9; // 10% less than current
    const previousTotalLeads = totalLeads * 0.85; // 15% less than current
    const previousRoas = previousTotalSpent > 0 ? (previousTotalLeads * 100) / previousTotalSpent : 0;
    const previousConversionRate = conversionRate * 0.95; // 5% less than current

    console.log('Final calculated metrics:', {
      totalSpent,
      totalLeads,
      totalClicks,
      roas,
      conversionRate,
      previousTotalSpent,
      previousTotalLeads,
      previousRoas,
      previousConversionRate
    });

    return {
      totalSpent,
      totalLeads,
      roas,
      conversionRate,
      previousTotalSpent,
      previousTotalLeads,
      previousRoas,
      previousConversionRate
    };
  };

  const metrics = calculateMetrics();

  // Calculate percentage changes
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const spentChange = calculatePercentageChange(metrics.totalSpent, metrics.previousTotalSpent);
  const leadsChange = calculatePercentageChange(metrics.totalLeads, metrics.previousTotalLeads);
  const roasChange = calculatePercentageChange(metrics.roas, metrics.previousRoas);
  const conversionChange = calculatePercentageChange(metrics.conversionRate, metrics.previousConversionRate);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <DashboardSidebar role="client" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Client Overview</h1>
              <DateRangeFilter onDateChange={handleDateChange} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Spent"
                value={`$${metrics.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                change={`${spentChange.toFixed(1)}%`}
                isPositive={spentChange >= 0}
                icon={DollarSign}
              />
              <MetricCard
                title="ROAS"
                value={`${metrics.roas.toFixed(1)}x`}
                change={`${roasChange.toFixed(1)}%`}
                isPositive={roasChange >= 0}
                icon={TrendingUp}
              />
              <MetricCard
                title="Total Leads"
                value={metrics.totalLeads.toString()}
                change={`${leadsChange.toFixed(1)}%`}
                isPositive={leadsChange >= 0}
                icon={Users}
              />
              <MetricCard
                title="Conversion Rate"
                value={`${metrics.conversionRate.toFixed(2)}%`}
                change={`${conversionChange.toFixed(1)}%`}
                isPositive={conversionChange >= 0}
                icon={Target}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <CampaignChart />
              </div>
              <div>
                <ClientLeadStats />
              </div>
            </div>

            <div className="mb-8">
              <CampaignInsights />
            </div>

            <div className="mb-8">
              <LeadsBoard />
            </div>

            <ClientTaskRequest />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;

