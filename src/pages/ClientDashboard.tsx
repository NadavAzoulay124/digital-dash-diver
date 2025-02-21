
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CampaignChart } from "@/components/dashboard/CampaignChart";
import { ClientTaskRequest } from "@/components/dashboard/ClientTaskRequest";
import { ClientLeadStats } from "@/components/dashboard/ClientLeadStats";
import { LeadsBoard } from "@/components/dashboard/LeadsBoard";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { CampaignInsights } from "@/components/dashboard/CampaignInsights";
import { FacebookCampaigns } from "@/components/dashboard/FacebookCampaigns";
import { DollarSign, TrendingUp, Users, Target, AlertCircle } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const ClientDashboard = () => {
  const { toast } = useToast();
  
  const handleDateChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    console.log('Date range changed:', { startDate, endDate });
  };

  const { data: facebookData, isError, isLoading } = useQuery({
    queryKey: ['facebook-campaigns'],
    queryFn: async () => {
      // First check if we have Facebook credentials
      const { data: credentials } = await supabase
        .from('facebook_ads_credentials')
        .select('*')
        .maybeSingle();

      if (!credentials) {
        return { data: [] };
      }

      // If we have credentials, fetch the campaigns
      const response = await supabase.functions.invoke('facebook-ads', {
        body: { }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch Facebook campaigns');
      }

      return response.data || { data: [] };
    },
    meta: {
      onError: (error: Error) => {
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
      return {
        totalSpent: 0,
        totalLeads: 0,
        roas: 0,
        conversionRate: 0
      };
    }

    return facebookData.data.reduce((acc, campaign) => {
      if (campaign.insights && campaign.insights.data[0]) {
        const insights = campaign.insights.data[0];
        const spent = parseFloat(insights.spend || '0');
        const leads = parseInt(insights.conversions || '0');
        const impressions = parseInt(insights.impressions || '0');
        
        return {
          totalSpent: acc.totalSpent + spent,
          totalLeads: acc.totalLeads + leads,
          roas: leads > 0 ? (acc.totalLeads * 100) / (acc.totalSpent || 1) : 0, // Assuming $100 value per lead
          conversionRate: impressions > 0 ? (leads / impressions) * 100 : 0
        };
      }
      return acc;
    }, { totalSpent: 0, totalLeads: 0, roas: 0, conversionRate: 0 });
  };

  const metrics = calculateMetrics();

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
                value={`$${metrics.totalSpent.toFixed(2)}`}
                change="+8.1%"
                isPositive={true}
                icon={DollarSign}
              />
              <MetricCard
                title="ROAS"
                value={`${metrics.roas.toFixed(1)}x`}
                change="+0.4x"
                isPositive={true}
                icon={TrendingUp}
              />
              <MetricCard
                title="Total Leads"
                value={metrics.totalLeads.toString()}
                change="+12"
                isPositive={true}
                icon={Users}
              />
              <MetricCard
                title="Conversion Rate"
                value={`${metrics.conversionRate.toFixed(2)}%`}
                change="+0.3%"
                isPositive={true}
                icon={Target}
              />
            </div>

            <div className="mb-8">
              {isLoading ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Loading campaign data...
                  </AlertDescription>
                </Alert>
              ) : isError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load campaign data. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : (
                <FacebookCampaigns campaigns={facebookData?.data || []} />
              )}
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
