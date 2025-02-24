
import { CampaignChart } from "@/components/dashboard/CampaignChart";
import { ClientTaskRequest } from "@/components/dashboard/ClientTaskRequest";
import { ClientLeadStats } from "@/components/dashboard/ClientLeadStats";
import { LeadsBoard } from "@/components/dashboard/LeadsBoard";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { CampaignInsights } from "@/components/dashboard/CampaignInsights";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { format } from "date-fns";
import { calculateMetrics } from "@/utils/metricsUtils";

const ClientDashboard = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ startDate?: Date; endDate?: Date }>({});
  
  const handleDateChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    setDateRange({ startDate, endDate });
  };

  const { data: facebookData } = useQuery({
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

  const metrics = calculateMetrics(facebookData?.data || []);

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
            
            <div className="mb-8">
              <DashboardMetrics metrics={metrics} />
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
